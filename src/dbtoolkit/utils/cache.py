"""Caching utilities for database metadata."""

import time
from typing import Dict, Any, Optional
from dataclasses import dataclass
from .constants import DEFAULT_CACHE_TTL


@dataclass
class CacheEntry:
    """Cache entry with timestamp."""
    data: Any
    timestamp: float
    ttl: float = DEFAULT_CACHE_TTL
    
    @property
    def is_expired(self) -> bool:
        """Check if cache entry is expired."""
        return time.time() - self.timestamp > self.ttl


class MetadataCache:
    """Simple in-memory cache for database metadata."""
    
    def __init__(self):
        """Initialize cache."""
        self._cache: Dict[str, CacheEntry] = {}
    
    def get(self, key: str) -> Optional[Any]:
        """Get cached value if not expired."""
        entry = self._cache.get(key)
        if entry and not entry.is_expired:
            return entry.data
        elif entry:
            # Remove expired entry
            del self._cache[key]
        return None
    
    def set(self, key: str, value: Any, ttl: float = DEFAULT_CACHE_TTL) -> None:
        """Set cache value with TTL."""
        self._cache[key] = CacheEntry(
            data=value,
            timestamp=time.time(),
            ttl=ttl
        )
    
    def clear(self, pattern: Optional[str] = None) -> None:
        """Clear cache entries matching pattern."""
        if pattern is None:
            self._cache.clear()
        else:
            keys_to_remove = [k for k in self._cache.keys() if pattern in k]
            for key in keys_to_remove:
                del self._cache[key]


# Global cache instance
metadata_cache = MetadataCache()