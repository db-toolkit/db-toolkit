"""Schema exploration operations."""

from typing import Dict, List, Any, Optional
from ..connectors.factory import ConnectorFactory
from ..core.models import DatabaseConnection
from ..utils.cache import SchemaCache


class SchemaExplorer:
    """Handles database schema exploration and metadata fetching."""
    
    def __init__(self):
        """Initialize schema explorer."""
        self.cache = SchemaCache()
    
    async def get_schema_tree(self, connection: DatabaseConnection, use_cache: bool = True) -> Dict[str, Any]:
        """Get complete schema tree for connection."""
        cache_key = f"{connection.id}_schema"
        
        if use_cache:
            cached = self.cache.get(cache_key)
            if cached:
                return cached
        
        try:
            connector = ConnectorFactory.create_connector(connection.db_type)
            await connector.connect(connection)
            
            schema_tree = {
                "connection_id": connection.id,
                "db_type": connection.db_type.value,
                "schemas": {}
            }
            
            schemas = await connector.get_schemas()
            
            for schema_name in schemas:
                tables = await connector.get_tables(schema_name)
                schema_tree["schemas"][schema_name] = {
                    "tables": {},
                    "table_count": len(tables)
                }
                
                for table_name in tables:
                    columns = await connector.get_columns(table_name, schema_name)
                    schema_tree["schemas"][schema_name]["tables"][table_name] = {
                        "columns": columns,
                        "column_count": len(columns)
                    }
            
            await connector.disconnect()
            
            # Cache the result
            self.cache.set(cache_key, schema_tree)
            
            return schema_tree
            
        except Exception as e:
            return {"error": str(e), "success": False}
    
    async def get_table_info(self, connection: DatabaseConnection, schema: str, table: str) -> Dict[str, Any]:
        """Get detailed table information."""
        try:
            connector = ConnectorFactory.create_connector(connection.db_type)
            await connector.connect(connection)
            
            columns = await connector.get_columns(table, schema)
            
            # Get sample data (first 5 rows)
            sample_query = self._build_sample_query(connection.db_type, schema, table)
            sample_result = await connector.execute_query(sample_query)
            
            await connector.disconnect()
            
            return {
                "success": True,
                "table": table,
                "schema": schema,
                "columns": columns,
                "sample_data": sample_result.get("data", [])[:5] if sample_result.get("success") else []
            }
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def _build_sample_query(self, db_type: str, schema: str, table: str) -> str:
        """Build sample data query for different database types."""
        if db_type == "mongodb":
            return "{}"  # Empty filter for MongoDB
        elif db_type == "sqlite":
            return f"SELECT * FROM {table} LIMIT 5"
        else:
            return f"SELECT * FROM {schema}.{table} LIMIT 5"
    
    async def refresh_schema(self, connection_id: str):
        """Refresh cached schema for connection."""
        cache_key = f"{connection_id}_schema"
        self.cache.delete(cache_key)
    
    def get_cached_schemas(self) -> List[str]:
        """Get list of cached schema keys."""
        return self.cache.get_keys()