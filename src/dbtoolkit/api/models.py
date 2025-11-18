"""Pydantic models for API requests and responses."""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class ConnectionRequest(BaseModel):
    """Database connection request model."""
    name: str
    db_type: str
    host: Optional[str] = None
    port: Optional[int] = None
    username: Optional[str] = None
    password: Optional[str] = None
    database: Optional[str] = None
    file_path: Optional[str] = None


class ConnectionResponse(BaseModel):
    """Database connection response model."""
    id: str
    name: str
    db_type: str
    host: Optional[str] = None
    port: Optional[int] = None
    username: Optional[str] = None
    database: Optional[str] = None
    file_path: Optional[str] = None


class QueryRequest(BaseModel):
    """Query execution request model."""
    connection_id: str
    query: str
    limit: Optional[int] = 1000


class QueryResponse(BaseModel):
    """Query execution response model."""
    columns: List[str]
    rows: List[List[Any]]
    total_rows: int
    execution_time: float


class SchemaNode(BaseModel):
    """Schema tree node model."""
    name: str
    type: str
    children: Optional[List['SchemaNode']] = None


class DataEditRequest(BaseModel):
    """Data edit request model."""
    connection_id: str
    table: str
    row_id: Any
    changes: Dict[str, Any]


class CSVImportRequest(BaseModel):
    """CSV import request model."""
    connection_id: str
    table: str
    file_path: str
    column_mapping: Dict[str, str]
    has_header: bool = True


class CSVExportRequest(BaseModel):
    """CSV export request model."""
    connection_id: str
    query: str
    file_path: str


class ApiResponse(BaseModel):
    """Generic API response model."""
    success: bool
    message: str
    data: Optional[Any] = None


SchemaNode.model_rebuild()