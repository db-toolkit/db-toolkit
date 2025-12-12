import { X, Download, Trash2, RotateCcw, Database, CheckCircle, XCircle, Clock, FolderOpen } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';

export function ScheduleBackupsModal({ isOpen, onClose, schedule, backups, onRestore, onDownload, onDelete, onShowInFolder }) {
  const formatSize = (bytes) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? `${(bytes / 1024).toFixed(2)} KB` : `${mb.toFixed(2)} MB`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'failed':
        return <XCircle className="text-red-500" size={16} />;
      case 'in_progress':
        return <Clock className="text-green-500 animate-spin" size={16} />;
      default:
        return <Clock className="text-gray-400" size={16} />;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Backups from "${schedule?.name}"`}>
      <div className="max-h-[500px] overflow-y-auto">
        {backups.length === 0 ? (
          <EmptyState
            icon={Database}
            title="No backups yet"
            description="This schedule hasn't created any backups yet"
          />
        ) : (
          <div className="space-y-3">
            {backups.map((backup) => (
              <div
                key={backup.id}
                className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-4"
              >
                <div className="flex items-start gap-3 mb-3">
                  <Database className="text-green-600 dark:text-green-400 mt-1" size={20} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{backup.name}</h4>
                      {getStatusIcon(backup.status)}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {formatDate(backup.created_at)} • {formatSize(backup.file_size)}
                    </p>
                    {backup.compressed && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                        Compressed
                      </span>
                    )}
                  </div>
                </div>

                {backup.error_message && (
                  <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-700 dark:text-red-300">
                    {backup.error_message}
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="success"
                    size="sm"
                    icon={<RotateCcw size={14} />}
                    onClick={() => onRestore(backup.id)}
                    disabled={backup.status !== 'completed'}
                  >
                    Restore
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Download size={14} />}
                    onClick={() => onDownload(backup.id, backup.file_path.split('/').pop())}
                    disabled={backup.status !== 'completed'}
                  >
                    Download
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<FolderOpen size={14} />}
                    onClick={() => onShowInFolder(backup.file_path)}
                    disabled={backup.status !== 'completed'}
                    title="Show in folder"
                  >
                    Show
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(backup.id)}
                    className="!px-2"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
