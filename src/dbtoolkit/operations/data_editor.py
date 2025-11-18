"""Data editing operations."""

import asyncio
from typing import Dict, Any, List, Optional, Union, Tuple
from datetime import datetime
from ..core.models import DatabaseConnection, DatabaseType
from ..core.data_editor import CellChange, EditSession, ChangeType, ValidationError, TableConstraint, ColumnInfo
from ..connectors.factory import ConnectorFactory


class DataEditor:
    """Handles data editing operations for database tables."""
    
    def __init__(self, connection: DatabaseConnection):
        """Initialize data editor."""
        self.connection = connection
        self.connector = ConnectorFactory.create_connector(connection)
        self._connected = False
        self.edit_session = EditSession(connection_id=connection.id, changes=[])
    
    async def connect(self) -> bool:
        """Connect to database."""
        if not self._connected:
            self._connected = await self.connector.connect()
        return self._connected
    
    async def disconnect(self) -> None:
        """Disconnect from database."""
        if self._connected:
            await self.connector.disconnect()
            self._connected = False
    
    async def get_table_constraints(self, table: str, schema: Optional[str] = None) -> List[TableConstraint]:
        """Get table constraints for validation."""
        if not await self.connect():
            raise ConnectionError("Failed to connect to database")
        
        constraints = []
        
        if self.connection.db_type == DatabaseType.POSTGRESQL:
            constraints = await self._get_postgresql_constraints(table, schema)
        elif self.connection.db_type == DatabaseType.MYSQL:
            constraints = await self._get_mysql_constraints(table, schema)
        elif self.connection.db_type == DatabaseType.SQLITE:
            constraints = await self._get_sqlite_constraints(table)
        
        return constraints
    
    async def update_cell(self, table: str, row_id: Union[str, int, Dict[str, Any]], 
                         column: str, new_value: Any, schema: Optional[str] = None) -> bool:
        """Update a single cell value."""
        if not await self.connect():
            return False
        
        try:
            # Get current value for rollback
            current_value = await self._get_cell_value(table, row_id, column, schema)
            
            # Create change record
            change = CellChange(
                table=table,
                schema=schema,
                row_id=row_id,
                column=column,
                old_value=current_value,
                new_value=new_value,
                change_type=ChangeType.UPDATE,
                timestamp=datetime.now()
            )
            
            # Validate change
            await self._validate_change(change)
            
            # Execute update
            success = await self._execute_update(change)
            
            if success and not self.edit_session.auto_commit:
                self.edit_session.add_change(change)
            
            return success
            
        except Exception as e:
            raise ValidationError(f"Update failed: {str(e)}")
    
    async def commit_changes(self) -> bool:
        """Commit all pending changes."""
        if not self.edit_session.has_changes():
            return True
        
        try:
            # Execute all changes in transaction
            for change in self.edit_session.changes:
                await self._execute_update(change)
            
            self.edit_session.clear()
            return True
            
        except Exception as e:
            raise ValidationError(f"Commit failed: {str(e)}")
    
    async def rollback_changes(self) -> bool:
        """Rollback all pending changes."""
        if not self.edit_session.has_changes():
            return True
        
        try:
            # Reverse all changes
            for change in reversed(self.edit_session.changes):
                rollback_change = CellChange(
                    table=change.table,
                    schema=change.schema,
                    row_id=change.row_id,
                    column=change.column,
                    old_value=change.new_value,
                    new_value=change.old_value,
                    change_type=change.change_type,
                    timestamp=datetime.now()
                )
                await self._execute_update(rollback_change)
            
            self.edit_session.clear()
            return True
            
        except Exception as e:
            raise ValidationError(f"Rollback failed: {str(e)}")
    
    async def _get_cell_value(self, table: str, row_id: Union[str, int, Dict[str, Any]], 
                             column: str, schema: Optional[str] = None) -> Any:
        """Get current cell value for rollback."""
        # Build WHERE clause based on row_id type
        if isinstance(row_id, dict):
            # Composite primary key
            where_parts = [f"{k} = '{v}'" for k, v in row_id.items()]
            where_clause = " AND ".join(where_parts)
        else:
            # Single primary key (assume 'id' column)
            where_clause = f"id = '{row_id}'"
        
        table_name = f"{schema}.{table}" if schema else table
        query = f"SELECT {column} FROM {table_name} WHERE {where_clause}"
        
        result = await self.connector.execute_query(query)
        return result[0][column] if result else None
    
    async def _validate_change(self, change: CellChange) -> None:
        """Validate a change before execution."""
        from .data_validator import DataValidator
        
        # Get column info (simplified - would need full implementation)
        column_info = ColumnInfo(
            name=change.column,
            data_type="text",  # Would get from schema
            is_nullable=True,
            is_primary_key=False,
            is_foreign_key=False,
            default_value=None
        )
        
        errors = DataValidator.validate_cell_change(change, column_info)
        if errors:
            raise ValidationError("; ".join(errors))
    
    async def _execute_update(self, change: CellChange) -> bool:
        """Execute the actual update query."""
        try:
            # Build WHERE clause
            if isinstance(change.row_id, dict):
                where_parts = [f"{k} = '{v}'" for k, v in change.row_id.items()]
                where_clause = " AND ".join(where_parts)
            else:
                where_clause = f"id = '{change.row_id}'"
            
            table_name = f"{change.schema}.{change.table}" if change.schema else change.table
            query = f"UPDATE {table_name} SET {change.column} = '{change.new_value}' WHERE {where_clause}"
            
            await self.connector.execute_query(query)
            return True
            
        except Exception:
            return False
    
    async def _get_postgresql_constraints(self, table: str, schema: Optional[str] = None) -> List[TableConstraint]:
        """Get PostgreSQL table constraints."""
        schema = schema or 'public'
        query = """
        SELECT tc.constraint_name, tc.constraint_type, kcu.column_name,
               ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints tc
        LEFT JOIN information_schema.key_column_usage kcu 
            ON tc.constraint_name = kcu.constraint_name
        LEFT JOIN information_schema.constraint_column_usage ccu 
            ON tc.constraint_name = ccu.constraint_name
        WHERE tc.table_name = %s AND tc.table_schema = %s
        """
        
        result = await self.connector.execute_query(
            query.replace('%s', f"'{table}'").replace('%s', f"'{schema}'")
        )
        
        constraints = []
        for row in result:
            constraints.append(TableConstraint(
                name=row['constraint_name'],
                type=row['constraint_type'],
                columns=[row['column_name']] if row['column_name'] else [],
                referenced_table=row.get('foreign_table_name'),
                referenced_columns=[row['foreign_column_name']] if row.get('foreign_column_name') else None
            ))
        
        return constraints
    
    async def _get_mysql_constraints(self, table: str, schema: Optional[str] = None) -> List[TableConstraint]:
        """Get MySQL table constraints."""
        schema = schema or self.connection.database
        query = f"SHOW CREATE TABLE {schema}.{table}"
        
        result = await self.connector.execute_query(query)
        constraints = []
        
        if result:
            create_sql = result[0].get('Create Table', '')
            if 'PRIMARY KEY' in create_sql:
                constraints.append(TableConstraint(
                    name='PRIMARY',
                    type='PRIMARY KEY',
                    columns=['id']
                ))
        
        return constraints
    
    async def _get_sqlite_constraints(self, table: str) -> List[TableConstraint]:
        """Get SQLite table constraints."""
        query = f"PRAGMA table_info({table})"
        result = await self.connector.execute_query(query)
        
        constraints = []
        for row in result:
            if row.get('pk'):
                constraints.append(TableConstraint(
                    name='PRIMARY',
                    type='PRIMARY KEY',
                    columns=[row['name']]
                ))
        
        return constraints