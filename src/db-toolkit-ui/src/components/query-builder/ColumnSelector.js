/**
 * Column selector component for SELECT clause
 */
import { X, ArrowUp, ArrowDown } from 'lucide-react';
import { getAggregateFunctions } from '../../utils/queryBuilder';

export function ColumnSelector({ columns, onUpdateColumn, onRemoveColumn, onReorder }) {
  const aggregates = getAggregateFunctions();

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Selected Columns ({columns.length})
      </h3>

      {columns.length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-gray-400 italic">
          Select columns from tables on the canvas
        </div>
      ) : (
        <div className="space-y-2">
          {columns.map((col, idx) => (
            <div key={`${col.table}.${col.name}`} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
              {/* Reorder buttons */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => onReorder(idx, idx - 1)}
                  disabled={idx === 0}
                  className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-30"
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  onClick={() => onReorder(idx, idx + 1)}
                  disabled={idx === columns.length - 1}
                  className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-30"
                >
                  <ArrowDown size={12} />
                </button>
              </div>

              {/* Column info */}
              <div className="flex-1 space-y-2">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {col.table}.{col.name}
                </div>

                <div className="flex gap-2">
                  {/* Aggregate */}
                  <select
                    value={col.aggregate || ''}
                    onChange={(e) => onUpdateColumn(idx, { aggregate: e.target.value || null })}
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">No aggregate</option>
                    {aggregates.map(agg => (
                      <option key={agg} value={agg}>{agg}</option>
                    ))}
                  </select>

                  {/* Alias */}
                  <input
                    type="text"
                    value={col.alias || ''}
                    onChange={(e) => onUpdateColumn(idx, { alias: e.target.value || null })}
                    placeholder="Alias (optional)"
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Remove */}
              <button
                onClick={() => onRemoveColumn(idx)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
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
