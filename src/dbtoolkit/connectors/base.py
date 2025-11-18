"""Base connector interface for database connections."""

from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from ..core.models import DatabaseConnection


class DatabaseConnector(ABC):
    """Abstract base class for database connectors."""
    
    def __init__(self, connection: DatabaseConnection):
        """Initialize connector with connection configuration."""
        self.connection = connection
        self._client = None
    
    @abstractmethod
    async def connect(self) -> bool:
        """Establish database connection."""
        pass
    
    @abstractmethod
    async def disconnect(self) -> None:
        """Close database connection."""
        pass
    
    @abstractmethod
    async def test_connection(self) -> bool:
        """Test if connection is valid."""
        pass
    
    @abstractmethod
    async def get_schemas(self) -> List[str]:
        """Get list of schemas/databases."""
        pass
    
    @abstractmethod
    async def get_tables(self, schema: Optional[str] = None) -> List[str]:
        """Get list of tables in schema."""
        pass
    
    @abstractmethod
    async def get_columns(self, table: str, schema: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get column information for table."""
        pass
    
    @abstractmethod
    async def execute_query(self, query: str) -> List[Dict[str, Any]]:
        """Execute query and return results."""
        pass
    
    @property
    def is_connected(self) -> bool:
        """Check if currently connected."""
        return self._client is not None