/**
 * GROUP BY builder component for query builder
 */
import { X, Plus } from 'lucide-react';
import { Button } from '../common/Button';

export function GroupByBuilder({ columns, groupBy, onUpdate }) {
    const availableColumns = columns.filter(col => !col.aggregate);

    const handleAdd = () => {
        if (availableColumns.length === 0) return;
        const firstCol = availableColumns[0];
        onUpdate([...groupBy, { table: firstCol.table, name: firstCol.name }]);
    };

    const handleRemove = (index) => {
        onUpdate(groupBy.filter((_, i) => i !== index));
    };

    const handleChange = (index, value) => {
        const [table, name] = value.split('.');
        const updated = [...groupBy];
        updated[index] = { table, name };
        onUpdate(updated);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Group By
                </h3>
                <Button
                    size="sm"
                    variant="secondary"
                    icon={<Plus size={14} />}
                    onClick={handleAdd}
                    disabled={availableColumns.length === 0}
                >
                    Add
                </Button>
            </div>

            {groupBy.length === 0 ? (
                <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                    {availableColumns.length === 0
                        ? 'Select non-aggregated columns first'
                        : 'No grouping applied'}
                </div>
            ) : (
                <div className="space-y-2">
                    {groupBy.map((group, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <select
                                value={`${group.table}.${group.name}`}
                                onChange={(e) => handleChange(idx, e.target.value)}
                                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                {availableColumns.map(col => (
                                    <option
                                        key={`${col.table}.${col.name}`}
                                        value={`${col.table}.${col.name}`}
                                    >
                                        {col.table}.{col.name}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={() => handleRemove(idx)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                aria-label="Remove group by column"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {groupBy.length > 0 && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    💡 Tip: All non-aggregated columns should be in GROUP BY
                </div>
            )}
        </div>
    );
}
