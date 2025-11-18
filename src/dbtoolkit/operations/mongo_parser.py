"""MongoDB query parser and executor."""

import re
import json
import ast
from typing import Dict, Any, List, Optional, Union
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase, AsyncIOMotorCollection


class MongoQueryParser:
    """Production-grade MongoDB query parser and executor."""
    
    def __init__(self, client: AsyncIOMotorClient, database_name: str):
        """Initialize parser with MongoDB client."""
        self.client = client
        self.database_name = database_name
        self.db = client[database_name]
    
    async def execute(self, query: str) -> List[Dict[str, Any]]:
        """Execute MongoDB query with full syntax support."""
        query = query.strip()
        
        # Handle different query types
        if query.startswith('use '):
            return await self._handle_use(query)
        elif query.startswith('show '):
            return await self._handle_show(query)
        elif query.startswith('db.'):
            return await self._handle_db_operation(query)
        else:
            raise ValueError(f"Unsupported MongoDB query: {query}")
    
    async def _handle_use(self, query: str) -> List[Dict[str, Any]]:
        """Handle 'use database' command."""
        match = re.match(r'use\s+(\w+)', query)
        if match:
            db_name = match.group(1)
            self.database_name = db_name
            self.db = self.client[db_name]
            return [{"switched_to": db_name}]
        raise ValueError("Invalid use command")
    
    async def _handle_show(self, query: str) -> List[Dict[str, Any]]:
        """Handle show commands."""
        if query == 'show dbs' or query == 'show databases':
            dbs = await self.client.list_database_names()
            return [{"database": name} for name in dbs]
        
        elif query == 'show collections':
            collections = await self.db.list_collection_names()
            return [{"collection": name} for name in collections]
        
        elif query.startswith('show users'):
            # Get database users (admin operation)
            try:
                result = await self.db.command("usersInfo")
                return result.get("users", [])
            except Exception:
                return [{"error": "Insufficient privileges to show users"}]
        
        else:
            raise ValueError(f"Unsupported show command: {query}")
    
    async def _handle_db_operation(self, query: str) -> List[Dict[str, Any]]:
        """Handle db.collection.operation() queries."""
        # Parse db.collection.method(args) pattern
        pattern = r'db\.(\w+)\.(\w+)\((.*)\)'
        match = re.match(pattern, query, re.DOTALL)
        
        if not match:
            raise ValueError("Invalid MongoDB query syntax")
        
        collection_name = match.group(1)
        method = match.group(2)
        args_str = match.group(3).strip()
        
        collection = self.db[collection_name]
        
        # Parse arguments
        args = self._parse_arguments(args_str) if args_str else []
        
        # Execute method
        return await self._execute_collection_method(collection, method, args)
    
    def _parse_arguments(self, args_str: str) -> List[Any]:
        """Parse JavaScript-style arguments to Python objects."""
        if not args_str:
            return []
        
        try:
            # Handle MongoDB-specific syntax
            args_str = self._convert_mongo_syntax(args_str)
            
            # Try to parse as JSON array
            if not args_str.startswith('['):
                args_str = f'[{args_str}]'
            
            return json.loads(args_str)
        
        except json.JSONDecodeError:
            # Fallback: try to evaluate as Python literal
            try:
                return ast.literal_eval(f'[{args_str}]')
            except (ValueError, SyntaxError):
                raise ValueError(f"Cannot parse arguments: {args_str}")
    
    def _convert_mongo_syntax(self, text: str) -> str:
        """Convert MongoDB syntax to JSON-compatible format."""
        # Convert ObjectId("...") to string
        text = re.sub(r'ObjectId\("([^"]+)"\)', r'"\1"', text)
        
        # Convert ISODate("...") to string
        text = re.sub(r'ISODate\("([^"]+)"\)', r'"\1"', text)
        
        # Convert NumberLong(...) to number
        text = re.sub(r'NumberLong\((\d+)\)', r'\1', text)
        
        # Convert true/false to True/False
        text = re.sub(r'\btrue\b', 'true', text)
        text = re.sub(r'\bfalse\b', 'false', text)
        
        # Convert undefined to null
        text = re.sub(r'\bundefined\b', 'null', text)
        
        return text
    
    async def _execute_collection_method(self, collection: AsyncIOMotorCollection, 
                                       method: str, args: List[Any]) -> List[Dict[str, Any]]:
        """Execute collection method with arguments."""
        
        if method == 'find':
            query_filter = args[0] if args else {}
            projection = args[1] if len(args) > 1 else None
            
            cursor = collection.find(query_filter, projection)
            documents = await cursor.to_list(length=1000)  # Limit results
            return [self._serialize_document(doc) for doc in documents]
        
        elif method == 'findOne':
            query_filter = args[0] if args else {}
            projection = args[1] if len(args) > 1 else None
            
            document = await collection.find_one(query_filter, projection)
            return [self._serialize_document(document)] if document else []
        
        elif method == 'count' or method == 'countDocuments':
            query_filter = args[0] if args else {}
            count = await collection.count_documents(query_filter)
            return [{"count": count}]
        
        elif method == 'distinct':
            field = args[0] if args else "_id"
            query_filter = args[1] if len(args) > 1 else {}
            
            values = await collection.distinct(field, query_filter)
            return [{"distinct_values": values}]
        
        elif method == 'aggregate':
            pipeline = args[0] if args else []
            
            cursor = collection.aggregate(pipeline)
            documents = await cursor.to_list(length=1000)
            return [self._serialize_document(doc) for doc in documents]
        
        elif method == 'insertOne':
            document = args[0] if args else {}
            result = await collection.insert_one(document)
            return [{"inserted_id": str(result.inserted_id), "acknowledged": result.acknowledged}]
        
        elif method == 'insertMany':
            documents = args[0] if args else []
            result = await collection.insert_many(documents)
            return [{"inserted_ids": [str(id) for id in result.inserted_ids], 
                    "acknowledged": result.acknowledged}]
        
        elif method == 'updateOne':
            query_filter = args[0] if args else {}
            update = args[1] if len(args) > 1 else {}
            
            result = await collection.update_one(query_filter, update)
            return [{"matched_count": result.matched_count, 
                    "modified_count": result.modified_count,
                    "acknowledged": result.acknowledged}]
        
        elif method == 'updateMany':
            query_filter = args[0] if args else {}
            update = args[1] if len(args) > 1 else {}
            
            result = await collection.update_many(query_filter, update)
            return [{"matched_count": result.matched_count, 
                    "modified_count": result.modified_count,
                    "acknowledged": result.acknowledged}]
        
        elif method == 'deleteOne':
            query_filter = args[0] if args else {}
            result = await collection.delete_one(query_filter)
            return [{"deleted_count": result.deleted_count, "acknowledged": result.acknowledged}]
        
        elif method == 'deleteMany':
            query_filter = args[0] if args else {}
            result = await collection.delete_many(query_filter)
            return [{"deleted_count": result.deleted_count, "acknowledged": result.acknowledged}]
        
        elif method == 'createIndex':
            index_spec = args[0] if args else {}
            options = args[1] if len(args) > 1 else {}
            
            index_name = await collection.create_index(list(index_spec.items()), **options)
            return [{"index_name": index_name}]
        
        elif method == 'dropIndex':
            index = args[0] if args else {}
            await collection.drop_index(index)
            return [{"dropped": True}]
        
        elif method == 'getIndexes' or method == 'listIndexes':
            cursor = collection.list_indexes()
            indexes = await cursor.to_list(length=None)
            return [self._serialize_document(idx) for idx in indexes]
        
        else:
            raise ValueError(f"Unsupported collection method: {method}")
    
    def _serialize_document(self, doc: Dict[str, Any]) -> Dict[str, Any]:
        """Serialize MongoDB document for JSON output."""
        if not doc:
            return {}
        
        serialized = {}
        for key, value in doc.items():
            if hasattr(value, '__dict__'):  # ObjectId, datetime, etc.
                serialized[key] = str(value)
            elif isinstance(value, dict):
                serialized[key] = self._serialize_document(value)
            elif isinstance(value, list):
                serialized[key] = [self._serialize_document(item) if isinstance(item, dict) else str(item) if hasattr(item, '__dict__') else item for item in value]
            else:
                serialized[key] = value
        
        return serialized