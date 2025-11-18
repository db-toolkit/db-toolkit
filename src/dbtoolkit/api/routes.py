"""FastAPI routes for DB Toolkit."""

from typing import List
from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse

from .models import (
    ConnectionRequest, ConnectionResponse, QueryRequest, QueryResponse,
    SchemaNode, DataEditRequest, CSVImportRequest, CSVExportRequest, ApiResponse
)
from ..core.storage import ConnectionStorage
from ..operations.query_executor import QueryExecutor
from ..operations.data_editor import DataEditor
from ..operations.csv_importer import CSVImporter
from ..operations.csv_exporter import CSVExporter
from ..connectors.factory import ConnectorFactory

router = APIRouter()
storage = ConnectionStorage()
query_executor = QueryExecutor()
data_editor = DataEditor()
csv_importer = CSVImporter()
csv_exporter = CSVExporter()


@router.get("/connections", response_model=List[ConnectionResponse])
async def get_connections():
    """Get all database connections."""
    connections = await storage.get_all_connections()
    return [ConnectionResponse(**conn.dict()) for conn in connections]


@router.post("/connections", response_model=ConnectionResponse)
async def create_connection(connection: ConnectionRequest):
    """Create a new database connection."""
    try:
        conn = await storage.add_connection(
            name=connection.name,
            db_type=connection.db_type,
            host=connection.host,
            port=connection.port,
            username=connection.username,
            password=connection.password,
            database=connection.database,
            file_path=connection.file_path
        )
        return ConnectionResponse(**conn.dict())
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/connections/{connection_id}")
async def delete_connection(connection_id: str):
    """Delete a database connection."""
    try:
        await storage.remove_connection(connection_id)
        return ApiResponse(success=True, message="Connection deleted")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/connections/{connection_id}/test")
async def test_connection(connection_id: str):
    """Test database connection."""
    try:
        connection = await storage.get_connection(connection_id)
        connector = ConnectorFactory.create_connector(connection.db_type)
        await connector.connect(connection)
        await connector.disconnect()
        return ApiResponse(success=True, message="Connection successful")
    except Exception as e:
        return ApiResponse(success=False, message=str(e))


@router.get("/connections/{connection_id}/schema", response_model=List[SchemaNode])
async def get_schema(connection_id: str):
    """Get database schema."""
    try:
        connection = await storage.get_connection(connection_id)
        connector = ConnectorFactory.create_connector(connection.db_type)
        await connector.connect(connection)
        
        schema = await connector.get_schema()
        nodes = []
        
        for db_name, tables in schema.items():
            db_node = SchemaNode(name=db_name, type="database", children=[])
            for table_name, columns in tables.items():
                table_node = SchemaNode(name=table_name, type="table", children=[])
                for column in columns:
                    col_node = SchemaNode(name=f"{column['name']} ({column['type']})", type="column")
                    table_node.children.append(col_node)
                db_node.children.append(table_node)
            nodes.append(db_node)
        
        await connector.disconnect()
        return nodes
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/query", response_model=QueryResponse)
async def execute_query(query_request: QueryRequest):
    """Execute SQL query."""
    try:
        result = await query_executor.execute_query(
            connection_id=query_request.connection_id,
            query=query_request.query,
            limit=query_request.limit
        )
        return QueryResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/query/history/{connection_id}")
async def get_query_history(connection_id: str):
    """Get query history for connection."""
    try:
        history = await query_executor.get_history(connection_id)
        return ApiResponse(success=True, data=history)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/data/edit")
async def edit_data(edit_request: DataEditRequest):
    """Edit table data."""
    try:
        await data_editor.update_row(
            connection_id=edit_request.connection_id,
            table=edit_request.table,
            row_id=edit_request.row_id,
            changes=edit_request.changes
        )
        return ApiResponse(success=True, message="Data updated")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/csv/import")
async def import_csv(import_request: CSVImportRequest, background_tasks: BackgroundTasks):
    """Import CSV file."""
    try:
        background_tasks.add_task(
            csv_importer.import_csv,
            connection_id=import_request.connection_id,
            table=import_request.table,
            file_path=import_request.file_path,
            column_mapping=import_request.column_mapping,
            has_header=import_request.has_header
        )
        return ApiResponse(success=True, message="Import started")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/csv/export")
async def export_csv(export_request: CSVExportRequest):
    """Export query results to CSV."""
    try:
        file_path = await csv_exporter.export_csv(
            connection_id=export_request.connection_id,
            query=export_request.query,
            file_path=export_request.file_path
        )
        return FileResponse(file_path, filename=file_path.split('/')[-1])
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return ApiResponse(success=True, message="API is healthy")