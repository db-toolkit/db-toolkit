import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { csvAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useNotifications } from '../../contexts/NotificationContext';

export function CsvImportModal({ isOpen, onClose, connectionId, schema, table, onSuccess }) {
  const [file, setFile] = useState(null);
  const [delimiter, setDelimiter] = useState(',');
  const [hasHeaders, setHasHeaders] = useState(true);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { addNotification } = useNotifications();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      toast.error('Please select a valid CSV file');
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csvContent = e.target.result;
        
        const response = await csvAPI.import({
          connection_id: connectionId,
          schema_name: schema,
          table_name: table,
          csv_content: csvContent,
          delimiter,
          has_headers: hasHeaders,
        });

        toast.success(`Imported ${response.data.rows_imported} rows`);
        addNotification({
          type: 'success',
          title: 'CSV Import Complete',
          message: `Successfully imported ${response.data.rows_imported} rows into ${table}`,
          action: { label: 'View', path: '/data-explorer' }
        });
        onSuccess?.();
        onClose();
      };
      reader.readAsText(file);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Import failed');
      addNotification({
        type: 'error',
        title: 'CSV Import Failed',
        message: error.response?.data?.detail || 'Failed to import CSV file',
        action: { label: 'Retry', path: '/data-explorer' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import from CSV">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            CSV File
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700"
          />
          {file && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Selected: {file.name}
            </p>
          )}
        </div>

        <Input
          label="Delimiter"
          value={delimiter}
          onChange={(e) => setDelimiter(e.target.value)}
          placeholder=","
          maxLength={1}
        />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={hasHeaders}
            onChange={(e) => setHasHeaders(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">First row contains headers</span>
        </label>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleImport} loading={loading} disabled={!file}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
      </div>
    </Modal>
  );
}
