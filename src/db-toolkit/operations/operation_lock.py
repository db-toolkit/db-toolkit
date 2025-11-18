"""Operation locking for concurrent access control."""

import asyncio
from typing import Dict


class OperationLock:
    """Manages locks for database operations to prevent conflicts."""

    def __init__(self):
        """Initialize operation lock manager."""
        self._locks: Dict[str, asyncio.Lock] = {}

    def get_lock(self, connection_id: str) -> asyncio.Lock:
        """Get or create lock for a connection."""
        if connection_id not in self._locks:
            self._locks[connection_id] = asyncio.Lock()
        return self._locks[connection_id]

    async def acquire(self, connection_id: str) -> bool:
        """Acquire lock for connection."""
        lock = self.get_lock(connection_id)
        return await lock.acquire()

    def release(self, connection_id: str):
        """Release lock for connection."""
        if connection_id in self._locks:
            self._locks[connection_id].release()

    def is_locked(self, connection_id: str) -> bool:
        """Check if connection is locked."""
        if connection_id in self._locks:
            return self._locks[connection_id].locked()
        return False

    def cleanup(self, connection_id: str):
        """Remove lock for disconnected connection."""
        if connection_id in self._locks:
            del self._locks[connection_id]


operation_lock = OperationLock()
