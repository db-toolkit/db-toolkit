import { AlertCircle, X } from 'lucide-react';

export function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
      <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-red-800">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-600 hover:text-red-800 flex-shrink-0"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
