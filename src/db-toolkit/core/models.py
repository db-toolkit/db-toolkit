"""Core data models."""

from typing import Optional
from pydantic import BaseModel
from enum import Enum


class DatabaseType(str, Enum):
    """Supported database types."""
    POSTGRESQL = "postgresql"
    MYSQL = "mysql"
    SQLITE = "sqlite"
    MONGODB = "mongodb"


class DatabaseConnection(BaseModel):
    """Database connection configuration."""
    id: str
    name: str
    db_type: DatabaseType
    host: Optional[str] = None
    port: Optional[int] = None
    username: Optional[str] = None
    password: Optional[str] = None
    database: Optional[str] = None
    file_path: Optional[str] = None