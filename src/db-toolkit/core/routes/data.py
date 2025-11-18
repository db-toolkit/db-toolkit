"""Data editing routes."""

from fastapi import APIRouter, HTTPException
from core.storage import ConnectionStorage
from core.schemas import UpdateRowRequest, InsertRowRequest, DeleteRowRequest
from operations.data_editor import DataEditor

router = APIRouter()
storage = ConnectionStorage()
editor = DataEditor()


@router.put("/connections/{connection_id}/data/row")
async def update_row(connection_id: str, request: UpdateRowRequest):
    """Update a table row."""
    connection = storage.get_connection(connection_id)
    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    result = await editor.update_row(
        connection=connection,
        table=request.table,
        schema=request.schema,
        primary_key=request.primary_key,
        changes=request.changes
    )
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return result


@router.post("/connections/{connection_id}/data/row")
async def insert_row(connection_id: str, request: InsertRowRequest):
    """Insert a new table row."""
    connection = storage.get_connection(connection_id)
    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    result = await editor.insert_row(
        connection=connection,
        table=request.table,
        schema=request.schema,
        data=request.data
    )
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return result


@router.delete("/connections/{connection_id}/data/row")
async def delete_row(connection_id: str, request: DeleteRowRequest):
    """Delete a table row."""
    connection = storage.get_connection(connection_id)
    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    result = await editor.delete_row(
        connection=connection,
        table=request.table,
        schema=request.schema,
        primary_key=request.primary_key
    )
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return result