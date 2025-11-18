"""Connection storage and management."""

import json
import uuid
from pathlib import Path
from typing import List, Optional, Dict, Any
from .config import config
from .models import DatabaseConnection


class ConnectionStorage:
    """Manages persistent storage of database connections."""
    
    def __init__(self):
        """Initialize connection storage."""
        self.connections_file = config.connections_file
        self._connections: Dict[str, DatabaseConnection] = {}
        self.load_connections()
    
    def load_connections(self) -> None:
        """Load connections from storage file."""
        if not self.connections_file.exists():
            return
        
        try:
            with open(self.connections_file, 'r') as f:
                data = json.load(f)
                for conn_data in data.get('connections', []):
                    conn = DatabaseConnection.from_dict(conn_data)
                    self._connections[conn.id] = conn
        except (json.JSONDecodeError, KeyError, ValueError) as e:
            print(f"Error loading connections: {e}")
    
    def save_connections(self) -> None:
        """Save connections to storage file."""
        data = {
            'connections': [conn.to_dict() for conn in self._connections.values()]
        }
        
        with open(self.connections_file, 'w') as f:
            json.dump(data, f, indent=2)
    
    def add_connection(self, connection: DatabaseConnection) -> str:
        """Add a new connection."""
        if not connection.id:
            connection.id = str(uuid.uuid4())
        
        self._connections[connection.id] = connection
        self.save_connections()
        return connection.id
    
    def update_connection(self, connection: DatabaseConnection) -> None:
        """Update existing connection."""
        if connection.id not in self._connections:
            raise ValueError(f"Connection {connection.id} not found")
        
        self._connections[connection.id] = connection
        self.save_connections()
    
    def delete_connection(self, connection_id: str) -> None:
        """Delete connection by ID."""
        if connection_id in self._connections:
            del self._connections[connection_id]
            self.save_connections()
    
    def get_connection(self, connection_id: str) -> Optional[DatabaseConnection]:
        """Get connection by ID."""
        return self._connections.get(connection_id)
    
    def get_all_connections(self) -> List[DatabaseConnection]:
        """Get all stored connections."""
        return list(self._connections.values())


# Global storage instance
connection_storage = ConnectionStorage()