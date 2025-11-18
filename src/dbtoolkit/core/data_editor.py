"""Data editing models and utilities."""

from dataclasses import dataclass
from typing import Dict, Any, List, Optional, Union
from enum import Enum
from datetime import datetime


class ChangeType(Enum):
    """Types of data changes."""
    INSERT = "insert"
    UPDATE = "update"
    DELETE = "delete"


class ValidationError(Exception):
    """Data validation error."""
    pass


@dataclass
class CellChange:
    """Represents a single cell change."""
    
    table: str
    schema: Optional[str]
    row_id: Union[str, int, Dict[str, Any]]  # Primary key or composite key
    column: str
    old_value: Any
    new_value: Any
    change_type: ChangeType
    timestamp: datetime
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            'table': self.table,
            'schema': self.schema,
            'row_id': self.row_id,
            'column': self.column,
            'old_value': self.old_value,
            'new_value': self.new_value,
            'change_type': self.change_type.value,
            'timestamp': self.timestamp.isoformat()
        }


@dataclass
class EditSession:
    """Manages a set of pending changes."""
    
    connection_id: str
    changes: List[CellChange]
    auto_commit: bool = False
    
    def add_change(self, change: CellChange) -> None:
        """Add a change to the session."""
        # Remove any existing change for the same cell
        self.changes = [c for c in self.changes 
                       if not (c.table == change.table and 
                              c.row_id == change.row_id and 
                              c.column == change.column)]
        
        # Add new change
        self.changes.append(change)
    
    def remove_change(self, table: str, row_id: Any, column: str) -> None:
        """Remove a specific change."""
        self.changes = [c for c in self.changes 
                       if not (c.table == table and 
                              c.row_id == row_id and 
                              c.column == column)]
    
    def get_changes_for_table(self, table: str, schema: Optional[str] = None) -> List[CellChange]:
        """Get all changes for a specific table."""
        return [c for c in self.changes 
                if c.table == table and c.schema == schema]
    
    def has_changes(self) -> bool:
        """Check if there are pending changes."""
        return len(self.changes) > 0
    
    def clear(self) -> None:
        """Clear all changes."""
        self.changes.clear()


@dataclass
class TableConstraint:
    """Database table constraint information."""
    
    name: str
    type: str  # PRIMARY_KEY, FOREIGN_KEY, UNIQUE, CHECK, NOT_NULL
    columns: List[str]
    referenced_table: Optional[str] = None
    referenced_columns: Optional[List[str]] = None
    
    def validates_column(self, column: str) -> bool:
        """Check if constraint applies to column."""
        return column in self.columns


@dataclass
class ColumnInfo:
    """Extended column information for editing."""
    
    name: str
    data_type: str
    is_nullable: bool
    is_primary_key: bool
    is_foreign_key: bool
    default_value: Any
    max_length: Optional[int] = None
    numeric_precision: Optional[int] = None
    numeric_scale: Optional[int] = None
    
    def validate_value(self, value: Any) -> bool:
        """Validate value against column constraints."""
        if value is None:
            return self.is_nullable
        
        # Type-specific validation would go here
        # This is a simplified version
        return True