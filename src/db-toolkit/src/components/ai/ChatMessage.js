import { memo, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export const ChatMessage = memo(({ message, index }) => {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy');
    }
  }, [toast]);

  return (
    <div
      key={message.id || index}
      className={`p-3 rounded-lg ${
        message.role === 'user'
          ? 'bg-green-50 dark:bg-green-900/20 ml-4'
          : 'bg-gray-50 dark:bg-gray-900 mr-4'
      }`}
    >
      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
        {message.role === 'user' ? 'You' : 'DBAssist'}
      </div>
      <div
        className={`text-sm ${
          message.type === 'sql'
            ? 'font-mono bg-gray-800 dark:bg-gray-950 text-green-400 p-2 rounded'
            : 'text-gray-700 dark:text-gray-300'
        }`}
      >
        {message.type === 'loading' ? (
          <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Streaming response...</span>
          </span>
        ) : (
          message.content
        )}
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';
