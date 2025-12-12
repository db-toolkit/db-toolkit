import { Trash2, Clock, CheckCircle, XCircle, Eye, FolderOpen } from 'lucide-react';
import { Button } from '../common/Button';

export function ScheduleCard({ schedule, onToggle, onDelete, onViewBackups, backupCount = 0, lastBackupStatus = null }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not scheduled';
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-4">
      <div className="flex items-start gap-3 mb-3">
        <Clock className="text-green-600 dark:text-green-400 mt-1" size={24} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{schedule.name}</h3>
            {schedule.enabled ? (
              <CheckCircle className="text-green-500" size={16} />
            ) : (
              <XCircle className="text-gray-400" size={16} />
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
            {schedule.backup_type.replace('_', ' ')} • {schedule.schedule}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Keep last {schedule.retention_count} backups
          </p>
          {schedule.last_run && (
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Last run: {formatDate(schedule.last_run)}
            </p>
          )}
          {schedule.next_run && (
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Next run: {formatDate(schedule.next_run)}
            </p>
          )}
        </div>
      </div>

      {backupCount > 0 && (
        <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-900/50 rounded text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              {backupCount} backup{backupCount !== 1 ? 's' : ''} created
            </span>
            {lastBackupStatus && (
              <span className={`flex items-center gap-1 ${
                lastBackupStatus === 'completed' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {lastBackupStatus === 'completed' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                Last: {lastBackupStatus}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {backupCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            icon={<Eye size={16} />}
            onClick={() => onViewBackups(schedule.id)}
          >
            View Backups
          </Button>
        )}
        <Button
          variant={schedule.enabled ? 'secondary' : 'success'}
          size="sm"
          onClick={() => onToggle(schedule.id, !schedule.enabled)}
        >
          {schedule.enabled ? 'Disable' : 'Enable'}
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(schedule.id)}
          className="!px-2"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
}
