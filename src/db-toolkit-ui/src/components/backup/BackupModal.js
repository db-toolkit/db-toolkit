import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export function BackupModal({ isOpen, onClose, onSave, connections }) {
  const [formData, setFormData] = useState({
    connection_id: '',
    name: '',
    backup_type: 'full',
    compress: true,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(formData);
    onClose();
    setFormData({ connection_id: '', name: '', backup_type: 'full', compress: true });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Backup">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Connection
          </label>
          <select
            value={formData.connection_id}
            onChange={(e) => handleChange('connection_id', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            required
          >
            <option value="">Select connection</option>
            {connections.map((conn) => (
              <option key={conn.id} value={conn.id}>
                {conn.name} ({conn.db_type})
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Backup Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="My Backup"
          required
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Backup Type
          </label>
          <select
            value={formData.backup_type}
            onChange={(e) => handleChange('backup_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="full">Full Backup</option>
            <option value="schema_only">Schema Only</option>
            <option value="data_only">Data Only</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.compress}
              onChange={(e) => handleChange('compress', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Compress backup (gzip)</span>
          </label>
        </div>

        <div className="flex gap-2 justify-end mt-6">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit">Create Backup</Button>
        </div>
      </form>
    </Modal>
  );
}
