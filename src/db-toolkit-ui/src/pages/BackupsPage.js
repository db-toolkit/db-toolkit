import { useState } from 'react';
import { Plus, Database } from 'lucide-react';
import { useBackups } from '../hooks/useBackups';
import { useConnections } from '../hooks';
import { useToast } from '../contexts/ToastContext';
import { Button } from '../components/common/Button';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { BackupCard } from '../components/backup/BackupCard';
import { BackupModal } from '../components/backup/BackupModal';

function BackupsPage() {
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const { connections } = useConnections();
  const { backups, loading, createBackup, restoreBackup, downloadBackup, deleteBackup, fetchBackups } = useBackups();

  const handleCreate = async (data) => {
    try {
      await createBackup(data);
      toast.success('Backup created successfully');
      setShowModal(false);
    } catch (err) {
      toast.error('Failed to create backup');
    }
  };

  const handleRestore = async (backupId) => {
    if (!window.confirm('Restore this backup? This will overwrite existing data.')) return;
    
    try {
      await restoreBackup(backupId);
      toast.success('Backup restored successfully');
    } catch (err) {
      toast.error('Failed to restore backup');
    }
  };

  const handleDownload = async (backupId, filename) => {
    try {
      await downloadBackup(backupId, filename);
      toast.success('Backup downloaded');
    } catch (err) {
      toast.error('Failed to download backup');
    }
  };

  const handleDelete = async (backupId) => {
    if (!window.confirm('Delete this backup? This cannot be undone.')) return;
    
    try {
      await deleteBackup(backupId);
      toast.success('Backup deleted');
    } catch (err) {
      toast.error('Failed to delete backup');
    }
  };

  if (loading) return <LoadingState fullScreen message="Loading backups..." />;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Database Backups</h2>
        <Button icon={<Plus size={20} />} onClick={() => setShowModal(true)}>
          New Backup
        </Button>
      </div>

      {backups.length === 0 ? (
        <EmptyState
          icon={Database}
          title="No backups yet"
          description="Create your first database backup to protect your data"
          action={
            <Button icon={<Plus size={20} />} onClick={() => setShowModal(true)}>
              Create Backup
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {backups.map((backup) => (
            <BackupCard
              key={backup.id}
              backup={backup}
              onRestore={handleRestore}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <BackupModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleCreate}
        connections={connections}
      />
    </div>
  );
}

export default BackupsPage;
