"""Caching utilities for database metadata."""

import time
from typing import Dict, Any, Optional, List


class SchemaCache:
    """In-memory cache for database schema metadata."""
    
    def __init__(self, default_ttl: int = 300):
        """Initialize cache with default TTL (5 minutes)."""
        self.cache: Dict[str, Dict[str, Any]] = {}
        self.default_ttl = default_ttl
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """Set cache value with TTL."""
        expiry = time.time() + (ttl or self.default_ttl)
        self.cache[key] = {
            "value": value,
            "expiry": expiry
        }
    
    def get(self, key: str) -> Optional[Any]:
        """Get cache value if not expired."""
        if key not in self.cache:
            return None
        
        entry = self.cache[key]
        if time.time() > entry["expiry"]:
            del self.cache[key]
            return None
        
        return entry["value"]
    
    def delete(self, key: str) -> bool:
        """Delete cache entry."""
        if key in self.cache:
            del self.cache[key]
            return True
        return False
    
    def clear(self) -> None:
        """Clear all cache entries."""
        self.cache.clear()
    
    def get_keys(self) -> List[str]:
        """Get all cache keys."""
        return list(self.cache.keys())
    
    def cleanup_expired(self) -> int:
        """Remove expired entries and return count."""
        current_time = time.time()
        expired_keys = [
            key for key, entry in self.cache.items()
            if current_time > entry["expiry"]
        ]
        
        for key in expired_keys:
            del self.cache[key]
        
        return len(expired_keys)