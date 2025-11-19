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


async def backup_scheduler_task():
    """Run scheduled backups."""
    from datetime import datetime
    from core.backup_storage import BackupStorage
    from core.storage import ConnectionStorage
    from operations.backup_manager import BackupManager
    
    backup_storage = BackupStorage()
    connection_storage = ConnectionStorage()
    backup_manager = BackupManager()
    
    while True:
        try:
            await asyncio.sleep(300)  # Check every 5 minutes
            
            schedules = await backup_storage.get_all_schedules()
            now = datetime.now()
            
            for schedule in schedules:
                if not schedule.enabled:
                    continue
                
                if schedule.next_run:
                    next_run = datetime.fromisoformat(schedule.next_run)
                    if now >= next_run:
                        connection = await connection_storage.get_connection(schedule.connection_id)
                        if connection:
                            await backup_manager.create_scheduled_backup(connection, schedule)
        except Exception as e:
            print(f"Error in backup scheduler: {e}")
