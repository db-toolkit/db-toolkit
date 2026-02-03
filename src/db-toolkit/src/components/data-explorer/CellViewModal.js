/**
 * Modal for viewing full cell content
 */
import { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { Button } from '../common/Button';
import { useToast } from '../../contexts/ToastContext';

export function CellViewModal({ isOpen, onClose, data, column }) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Extract actual data if it's wrapped in response object
  const actualData = data?.data !== undefined ? data.data : data;

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

  const displayData = formatData(actualData);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayData);
    toast.success('Copied to clipboard');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {column}
          </h3>
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              icon={copied ? <Check size={16} /> : <Copy size={16} />} 
              onClick={handleCopy}
            >
              {copied ? 'Copied' : 'Copy'}
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
