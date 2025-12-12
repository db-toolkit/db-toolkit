/**
 * ORDER BY builder component for query builder
 */
import { X, Plus, GripVertical } from 'lucide-react';
import { Button } from '../common/Button';

export function OrderByBuilder({ columns, orderBy, onUpdate }) {
    const handleAdd = () => {
        if (columns.length === 0) return;
        const firstCol = columns[0];
        onUpdate([...orderBy, {
            table: firstCol.table,
            name: firstCol.name,
            direction: 'ASC'
        }]);
    };

    const handleRemove = (index) => {
        onUpdate(orderBy.filter((_, i) => i !== index));
    };

    const handleChange = (index, field, value) => {
        const updated = [...orderBy];
        if (field === 'column') {
            const [table, name] = value.split('.');
            updated[index] = { ...updated[index], table, name };
        } else {
            updated[index] = { ...updated[index], [field]: value };
        }
        onUpdate(updated);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Order By
                </h3>
                <Button
                    size="sm"
                    variant="secondary"
                    icon={<Plus size={14} />}
                    onClick={handleAdd}
                    disabled={columns.length === 0}
                >
                    Add
                </Button>
            </div>

            {orderBy.length === 0 ? (
                <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                    {columns.length === 0
                        ? 'Select columns first'
                        : 'No sorting applied'}
                </div>
            ) : (
                <div className="space-y-2">
                    {orderBy.map((order, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            {/* Drag handle for future reordering */}
                            <div className="cursor-grab text-gray-400 dark:text-gray-500">
                                <GripVertical size={16} />
                            </div>

                            {/* Column selector */}
                            <select
                                value={`${order.table}.${order.name}`}
                                onChange={(e) => handleChange(idx, 'column', e.target.value)}
                                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                {columns.map(col => (
                                    <option
                                        key={`${col.table}.${col.name}`}
                                        value={`${col.table}.${col.name}`}
                                    >
                                        {col.table}.{col.name}
                                    </option>
                                ))}
                            </select>

                            {/* Direction selector */}
                            <select
                                value={order.direction}
                                onChange={(e) => handleChange(idx, 'direction', e.target.value)}
                                className="w-24 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="ASC">ASC ↑</option>
                                <option value="DESC">DESC ↓</option>
                            </select>

                            {/* Remove button */}
                            <button
                                onClick={() => handleRemove(idx)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                aria-label="Remove order by column"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
