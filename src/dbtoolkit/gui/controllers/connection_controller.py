"""Connection management controller."""

from PySide6.QtCore import QObject, Signal, Slot, Property
from PySide6.QtQml import QmlElement
from typing import List
from ...core.storage import connection_storage
from ...core.models import DatabaseConnection, DatabaseType
from ...connectors.factory import ConnectorFactory

QML_IMPORT_NAME = "DBToolkit"
QML_IMPORT_MAJOR_VERSION = 1


@QmlElement
class ConnectionController(QObject):
    """Controller for managing database connections."""
    
    connectionsChanged = Signal()
    connectionTestResult = Signal(bool, str, arguments=['success', 'message'])
    
    def __init__(self):
        """Initialize connection controller."""
        super().__init__()
        self._connections = []
        self.load_connections()
    
    @Property(list, notify=connectionsChanged)
    def connections(self) -> List[dict]:
        """Get list of connections for QML."""
        return self._connections
    
    @Slot()
    def load_connections(self) -> None:
        """Load connections from storage."""
        connections = connection_storage.get_all_connections()
        self._connections = [conn.to_dict() for conn in connections]
        self.connectionsChanged.emit()
    
    @Slot(str, str, str, str, int, str, str, str)
    def add_connection(self, name: str, db_type: str, host: str, username: str, 
                      port: int, password: str, database: str, file_path: str) -> None:
        """Add new database connection."""
        try:
            connection = DatabaseConnection(
                id="",  # Will be generated
                name=name,
                db_type=DatabaseType(db_type),
                host=host if host else None,
                port=port if port > 0 else None,
                username=username if username else None,
                password=password if password else None,
                database=database if database else None,
                file_path=file_path if file_path else None
            )
            
            connection_storage.add_connection(connection)
            self.load_connections()
            
        except Exception as e:
            print(f"Error adding connection: {e}")
    
    @Slot(str)
    def delete_connection(self, connection_id: str) -> None:
        """Delete connection by ID."""
        try:
            connection_storage.delete_connection(connection_id)
            self.load_connections()
        except Exception as e:
            print(f"Error deleting connection: {e}")
    
    @Slot(str)
    def test_connection(self, connection_id: str) -> None:
        """Test database connection."""
        try:
            connection = connection_storage.get_connection(connection_id)
            if not connection:
                self.connectionTestResult.emit(False, "Connection not found")
                return
            
            # For now, just check if we can create a connector
            connector = ConnectorFactory.create_connector(connection)
            self.connectionTestResult.emit(True, "Connection configuration valid")
            
        except Exception as e:
            self.connectionTestResult.emit(False, f"Connection test failed: {str(e)}")
    
    @Slot(result=list)
    def get_supported_database_types(self) -> List[str]:
        """Get list of supported database types."""
        return [db_type.value for db_type in ConnectorFactory.get_supported_types()]