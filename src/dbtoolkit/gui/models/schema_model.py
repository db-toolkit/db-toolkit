"""Qt model for database schema tree view."""

from PySide6.QtCore import QAbstractItemModel, QModelIndex, Qt, QObject
from PySide6.QtQml import QmlElement
from typing import List, Dict, Any, Optional
from ...utils.constants import QML_IMPORT_NAME, QML_IMPORT_MAJOR_VERSION


class SchemaItem:
    """Tree item for schema hierarchy."""
    
    def __init__(self, data: Dict[str, Any], parent: Optional['SchemaItem'] = None):
        """Initialize schema item."""
        self.item_data = data
        self.parent_item = parent
        self.child_items: List['SchemaItem'] = []
    
    def append_child(self, item: 'SchemaItem') -> None:
        """Add child item."""
        self.child_items.append(item)
    
    def child(self, row: int) -> Optional['SchemaItem']:
        """Get child at row."""
        if 0 <= row < len(self.child_items):
            return self.child_items[row]
        return None
    
    def child_count(self) -> int:
        """Get number of children."""
        return len(self.child_items)
    
    def column_count(self) -> int:
        """Get number of columns."""
        return len(self.item_data)
    
    def data(self, column: int) -> Any:
        """Get data for column."""
        keys = list(self.item_data.keys())
        if 0 <= column < len(keys):
            return self.item_data[keys[column]]
        return None
    
    def parent(self) -> Optional['SchemaItem']:
        """Get parent item."""
        return self.parent_item
    
    def row(self) -> int:
        """Get row number in parent."""
        if self.parent_item:
            return self.parent_item.child_items.index(self)
        return 0


@QmlElement
class SchemaModel(QAbstractItemModel):
    """Qt model for database schema tree."""
    
    def __init__(self, parent: Optional[QObject] = None):
        """Initialize schema model."""
        super().__init__(parent)
        self.root_item = SchemaItem({"name": "Root", "type": "root"})
    
    def columnCount(self, parent: QModelIndex = QModelIndex()) -> int:
        """Get column count."""
        if parent.isValid():
            return parent.internalPointer().column_count()
        return self.root_item.column_count()
    
    def data(self, index: QModelIndex, role: int = Qt.DisplayRole) -> Any:
        """Get data for index and role."""
        if not index.isValid():
            return None
        
        if role != Qt.DisplayRole:
            return None
        
        item: SchemaItem = index.internalPointer()
        return item.data(index.column())
    
    def flags(self, index: QModelIndex) -> Qt.ItemFlags:
        """Get item flags."""
        if not index.isValid():
            return Qt.NoItemFlags
        return Qt.ItemIsEnabled | Qt.ItemIsSelectable
    
    def headerData(self, section: int, orientation: Qt.Orientation, role: int = Qt.DisplayRole) -> Any:
        """Get header data."""
        if orientation == Qt.Horizontal and role == Qt.DisplayRole:
            return self.root_item.data(section)
        return None
    
    def index(self, row: int, column: int, parent: QModelIndex = QModelIndex()) -> QModelIndex:
        """Create index for row/column under parent."""
        if not self.hasIndex(row, column, parent):
            return QModelIndex()
        
        if not parent.isValid():
            parent_item = self.root_item
        else:
            parent_item = parent.internalPointer()
        
        child_item = parent_item.child(row)
        if child_item:
            return self.createIndex(row, column, child_item)
        return QModelIndex()
    
    def parent(self, index: QModelIndex) -> QModelIndex:
        """Get parent index."""
        if not index.isValid():
            return QModelIndex()
        
        child_item: SchemaItem = index.internalPointer()
        parent_item = child_item.parent()
        
        if parent_item == self.root_item:
            return QModelIndex()
        
        return self.createIndex(parent_item.row(), 0, parent_item)
    
    def rowCount(self, parent: QModelIndex = QModelIndex()) -> int:
        """Get row count."""
        if parent.column() > 0:
            return 0
        
        if not parent.isValid():
            parent_item = self.root_item
        else:
            parent_item = parent.internalPointer()
        
        return parent_item.child_count()
    
    def load_schema_data(self, schema_data: List[Dict[str, Any]]) -> None:
        """Load schema data into model."""
        self.beginResetModel()
        
        # Clear existing data
        self.root_item = SchemaItem({"name": "Database", "type": "root"})
        
        # Group data by schema
        schemas = {}
        for item in schema_data:
            schema_name = item.get('schema', 'public')
            if schema_name not in schemas:
                schemas[schema_name] = []
            schemas[schema_name].append(item)
        
        # Build tree structure
        for schema_name, items in schemas.items():
            schema_item = SchemaItem({"name": schema_name, "type": "schema"}, self.root_item)
            self.root_item.append_child(schema_item)
            
            # Group by table
            tables = {}
            for item in items:
                table_name = item.get('table')
                if table_name and table_name not in tables:
                    tables[table_name] = []
                if table_name:
                    tables[table_name].append(item)
            
            for table_name, table_items in tables.items():
                table_item = SchemaItem({"name": table_name, "type": "table"}, schema_item)
                schema_item.append_child(table_item)
                
                # Add columns
                for column_info in table_items:
                    if column_info.get('column_name'):
                        column_item = SchemaItem({
                            "name": column_info['column_name'],
                            "type": "column",
                            "data_type": column_info.get('data_type', '')
                        }, table_item)
                        table_item.append_child(column_item)
        
        self.endResetModel()