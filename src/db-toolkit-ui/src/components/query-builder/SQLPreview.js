/**
 * SQL preview panel showing generated query
 */
import { useState } from 'react';
import { Copy, Check, Play } from 'lucide-react';
import { Button } from '../common/Button';

export function SQLPreview({ sql, onExecute, isExecuting }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">SQL Preview</h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            icon={copied ? <Check size={14} /> : <Copy size={14} />}
            onClick={handleCopy}
            disabled={!sql}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button
            size="sm"
            icon={<Play size={14} />}
            onClick={onExecute}
            disabled={!sql || isExecuting}
          >
            {isExecuting ? 'Running...' : 'Run Query'}
          </Button>
        </div>
      </div>

      <div className="p-4">
        {!sql ? (
          <div className="text-sm text-gray-500 dark:text-gray-400 italic">
            Add tables and select columns to generate SQL
          </div>
        ) : (
          <pre className="text-sm font-mono text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
            {sql}
          </pre>
        )}
      </div>
    </div>
  );
}
