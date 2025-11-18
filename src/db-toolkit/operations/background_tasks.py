"""Background tasks for maintenance."""

import asyncio
from operations.query_history import QueryHistory
from core.settings_storage import SettingsStorage


async def cleanup_old_history_task():
    """Periodically cleanup old query history."""
    history = QueryHistory()
    settings_storage = SettingsStorage()
    
    while True:
        try:
            # Wait 24 hours
            await asyncio.sleep(24 * 60 * 60)
            
            # Get retention days from settings
            settings = await settings_storage.get_settings()
            retention_days = settings.query_history_retention_days
            
            # Cleanup old history
            removed = history.cleanup_old_history(retention_days)
            print(f"Cleaned up {removed} old query history entries")
        except Exception as e:
            print(f"Error in history cleanup task: {e}")
