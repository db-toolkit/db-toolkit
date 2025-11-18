"""API routes."""

from typing import List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..core.storage import ConnectionStorage
from ..core.models import DatabaseConnection, DatabaseType

router = APIRouter()
storage = ConnectionStorage()


class ConnectionRequest(BaseModel):
    """Connection creation request."""
    name: str
    db_type: DatabaseType
    host: str = None
    port: int = None
    username: str = None
    password: str = None
    database: str = None
    file_path: str = None


@router.get("/connections", response_model=List[DatabaseConnection])
def get_connections():
    """Get all connections."""
    return storage.get_all_connections()


@router.post("/connections", response_model=DatabaseConnection)
def create_connection(request: ConnectionRequest):
    """Create new connection."""
    try:
        return storage.add_connection(**request.model_dump())
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/connections/{connection_id}")
def delete_connection(connection_id: str):
    """Delete connection."""
    if storage.remove_connection(connection_id):
        return {"success": True}
    raise HTTPException(status_code=404, detail="Connection not found")


@router.get("/health")
def health_check():
    """Health check."""
    return {"status": "healthy"}