/**
 * LIMIT and OFFSET builder component for query builder
 */
import { Hash } from 'lucide-react';

export function LimitBuilder({ limit, offset, onUpdate }) {
    const handleLimitChange = (value) => {
        const numValue = value === '' ? null : parseInt(value);
        onUpdate({ limit: numValue, offset });
    };

    const handleOffsetChange = (value) => {
        const numValue = value === '' ? null : parseInt(value);
        onUpdate({ limit, offset: numValue });
    };

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Limit & Offset
            </h3>

            <div className="space-y-2">
                {/* Limit input */}
                <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Limit (max rows)
                    </label>
                    <div className="relative">
                        <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="number"
                            min="1"
                            value={limit || ''}
                            onChange={(e) => handleLimitChange(e.target.value)}
                            placeholder="No limit"
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* Offset input */}
                <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Offset (skip rows)
                    </label>
                    <div className="relative">
                        <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="number"
                            min="0"
                            value={offset || ''}
                            onChange={(e) => handleOffsetChange(e.target.value)}
                            placeholder="No offset"
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                        />
                    </div>
                </div>
            </div>

            {(limit || offset) && (
                <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    {limit && offset && `Showing rows ${offset + 1} to ${offset + limit}`}
                    {limit && !offset && `Showing first ${limit} rows`}
                    {!limit && offset && `Skipping first ${offset} rows`}
                </div>
            )}
        </div>
    );
}
