"""Data editing schemas."""

from typing import Dict, Any
from pydantic import BaseModel


class UpdateRowRequest(BaseModel):
    """Update row request."""
    table: str
    schema: str = "public"
    primary_key: Dict[str, Any]
    changes: Dict[str, Any]


class InsertRowRequest(BaseModel):
    """Insert row request."""
    table: str
    schema: str = "public"
    data: Dict[str, Any]


class DeleteRowRequest(BaseModel):
    """Delete row request."""
    table: str
    schema: str = "public"
    primary_key: Dict[str, Any]