/**
 * Modal for adding a new row to a table
 */
import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../common/Button';
import { useToast } from '../../contexts/ToastContext';

export function AddRowModal({ isOpen, onClose, columns, onSave, tableName }) {
  const toast = useToast();
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleChange = (columnName, value) => {
    setFormData(prev => ({
      ...prev,
      [columnName]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await onSave(formData);
      toast.success('Row added successfully');
      setFormData({});
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to add row');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setFormData({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Add Row to {tableName}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6">
          <div className="space-y-4">
            {columns.map((column) => (
              <div key={column.column_name}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {column.column_name}
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    ({column.data_type})
                  </span>
                </label>
                <input
                  type="text"
                  value={formData[column.column_name] || ''}
                  onChange={(e) => handleChange(column.column_name, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder={`Enter ${column.column_name}`}
                />
              </div>
            ))}
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Adding...' : 'Add Row'}
          </Button>
        </div>
      </div>
    </div>
  );
}
