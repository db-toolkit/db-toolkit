import { useEffect, useState } from 'react';
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
  const [inlineError, setInlineError] = useState('');
  const [importSummary, setImportSummary] = useState(null);
  const toast = useToast();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setDelimiter(',');
      setHasHeaders(true);
      setLoading(false);
      setInlineError('');
      setImportSummary(null);
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setInlineError('');
      setImportSummary(null);
    } else {
      toast.error('Please select a valid CSV file');
    }
  };

  const readFileAsText = (selectedFile) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read CSV file'));
      reader.readAsText(selectedFile);
    });

  const buildIdentityColumnMapping = (csvContent, selectedDelimiter) => {
    const [headerLine] = String(csvContent).split('\n');
    if (!headerLine) return {};

    return headerLine
      .split(selectedDelimiter)
      .map((h) => h.trim().replace(/^"|"$/g, ''))
      .filter(Boolean)
      .reduce((acc, header) => {
        acc[header] = header;
        return acc;
      }, {});
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    if (!hasHeaders) {
      const msg = 'CSV import currently requires headers to map columns.';
      setInlineError(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);
    setInlineError('');
    setImportSummary(null);

    try {
      const csvContent = await readFileAsText(file);
      const columnMapping = buildIdentityColumnMapping(csvContent, delimiter);

      if (Object.keys(columnMapping).length === 0) {
        throw new Error('Could not detect CSV headers');
      }

      const response = await csvAPI.import(connectionId, {
        schema_name: schema,
        table,
        csv_content: csvContent,
        delimiter,
        has_headers: hasHeaders,
        column_mapping: columnMapping,
      });
      const result = response?.data || response;

      setImportSummary(result);

      if (!result?.success) {
        const firstError = result?.errors?.[0];
        const errorMsg = firstError || result?.error || 'Import failed';
        setInlineError(errorMsg);
        toast.error(errorMsg);
        addNotification({
          type: 'error',
          title: 'CSV Import Failed',
          message: errorMsg,
          action: { label: 'Retry', path: '/data-explorer' }
        });
        return;
      }

      toast.success(`Imported ${result.imported} rows`);
      addNotification({
        type: 'success',
        title: 'CSV Import Complete',
        message: `Imported ${result.imported} rows into ${table}${result.failed ? ` (${result.failed} failed)` : ''}`,
        action: { label: 'View', path: '/data-explorer' }
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      const message = error?.response?.data?.detail || error?.message || 'Import failed';
      setInlineError(message);
      toast.error(message);
      addNotification({
        type: 'error',
        title: 'CSV Import Failed',
        message,
        action: { label: 'Retry', path: '/data-explorer' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import from CSV">
      <div className="space-y-4">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Target: {schema}.{table}
          </p>
        </div>

        {inlineError && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-300">{inlineError}</p>
            {importSummary?.errors?.length > 1 && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                + {importSummary.errors.length - 1} more error(s)
              </p>
            )}
          </div>
        )}

        {importSummary?.success && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-300">
              Imported {importSummary.imported} rows{importSummary.failed ? `, ${importSummary.failed} failed` : ''}.
            </p>
          </div>
        )}

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
          <Button onClick={handleImport} loading={loading} disabled={!file || loading}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
      </div>
    </Modal>
  );
}
