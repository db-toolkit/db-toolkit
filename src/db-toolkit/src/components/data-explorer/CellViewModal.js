/**
 * Modal for viewing full cell content
 */
import { X, Copy } from 'lucide-react';
import { Button } from '../common/Button';
import { useToast } from '../../contexts/ToastContext';

export function CellViewModal({ isOpen, onClose, data, column }) {
  const toast = useToast();

  if (!isOpen) return null;

  // Format data for display
  const formatData = (value) => {
    if (value === null || value === undefined) return 'NULL';
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value, null, 2);
      } catch (e) {
        return String(value);
      }
    }
    return String(value);
  };

  const displayData = formatData(data);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayData);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {column}
          </h3>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" icon={<Copy size={16} />} onClick={handleCopy}>
              Copy
            </Button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-auto flex-1">
          <pre className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
            {displayData}
          </pre>
        </div>
      </div>
    </div>
  );
}
