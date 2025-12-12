/**
 * Error display component for query builder validation errors
 */
import { X, AlertCircle } from 'lucide-react';

export function ErrorDisplay({ errors, onDismiss }) {
    if (!errors || errors.length === 0) return null;

    return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
                <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />

                <div className="flex-1">
                    <h4 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">
                        Query Validation Errors
                    </h4>
                    <ul className="text-sm text-red-700 dark:text-red-400 space-y-1">
                        {errors.map((error, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                                <span className="text-red-500 dark:text-red-400">•</span>
                                <span>{error}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded p-1 transition"
                        aria-label="Dismiss errors"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}
