"""PostgreSQL database connector."""

import asyncpg
from typing import List, Dict, Any, Optional
from .base import DatabaseConnector


class PostgreSQLConnector(DatabaseConnector):
    """PostgreSQL database connector using asyncpg."""
    
    async def connect(self) -> bool:
        """Establish PostgreSQL connection."""
        try:
            self._client = await asyncpg.connect(
                host=self.connection.host,
                port=self.connection.port,
                user=self.connection.username,
                password=self.connection.password,
                database=self.connection.database,
                command_timeout=self.connection.connection_timeout
            )
            return True
        except Exception as e:
            print(f"PostgreSQL connection failed: {e}")
            return False
    
    async def disconnect(self) -> None:
        """Close PostgreSQL connection."""
        if self._client:
            await self._client.close()
            self._client = None
    
    async def test_connection(self) -> bool:
        """Test PostgreSQL connection."""
        if not self.is_connected:
            return await self.connect()
        
        try:
            await self._client.fetchval("SELECT 1")
            return True
        except Exception:
            return False
    
    async def get_schemas(self) -> List[str]:
        """Get list of PostgreSQL schemas."""
        query = """
        SELECT schema_name 
        FROM information_schema.schemata 
        WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
        ORDER BY schema_name
        """
        rows = await self._client.fetch(query)
        return [row['schema_name'] for row in rows]
    
    async def get_tables(self, schema: Optional[str] = None) -> List[str]:
        """Get list of tables in schema."""
        schema = schema or 'public'
        query = """
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = $1 AND table_type = 'BASE TABLE'
        ORDER BY table_name
        """
        rows = await self._client.fetch(query, schema)
        return [row['table_name'] for row in rows]
    
    async def get_columns(self, table: str, schema: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get column information for table."""
        schema = schema or 'public'
        query = """
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_schema = $1 AND table_name = $2
        ORDER BY ordinal_position
        """
        rows = await self._client.fetch(query, schema, table)
        return [dict(row) for row in rows]
    
    async def execute_query(self, query: str) -> List[Dict[str, Any]]:
        """Execute query and return results."""
        rows = await self._client.fetch(query)
        return [dict(row) for row in rows]