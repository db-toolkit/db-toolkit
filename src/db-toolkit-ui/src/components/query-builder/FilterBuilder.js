/**
 * Filter builder component for WHERE conditions
 */
import { X, Plus } from 'lucide-react';
import { Button } from '../common/Button';
import { getOperatorsForType } from '../../utils/queryBuilder';

export function FilterBuilder({ filters, tables, onAddFilter, onUpdateFilter, onRemoveFilter }) {
  const allColumns = tables.flatMap(table =>
    table.columns.map(col => ({
      table: table.name,
      column: col.name,
      type: col.data_type || col.type
    }))
  );

  const handleAdd = () => {
    onAddFilter({
      id: Date.now(),
      table: allColumns[0]?.table || '',
      column: allColumns[0]?.column || '',
      operator: '=',
      value: '',
      logic: 'AND'
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filters</h3>
        <Button size="sm" variant="secondary" icon={<Plus size={14} />} onClick={handleAdd}>
          Add Filter
        </Button>
      </div>

      {filters.length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-gray-400 italic">
          No filters applied
        </div>
      ) : (
        <div className="space-y-2">
          {filters.map((filter, idx) => {
            const selectedCol = allColumns.find(
              c => c.table === filter.table && c.column === filter.column
            );
            const operators = getOperatorsForType(selectedCol?.type);

            return (
              <div key={filter.id} className="space-y-2">
                {idx > 0 && (
                  <select
                    value={filter.logic}
                    onChange={(e) => onUpdateFilter(filter.id, { logic: e.target.value })}
                    className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </select>
                )}

                <div className="flex items-center gap-2">
                  {/* Column */}
                  <select
                    value={`${filter.table}.${filter.column}`}
                    onChange={(e) => {
                      const [table, column] = e.target.value.split('.');
                      onUpdateFilter(filter.id, { table, column });
                    }}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {allColumns.map(col => (
                      <option key={`${col.table}.${col.column}`} value={`${col.table}.${col.column}`}>
                        {col.table}.{col.column}
                      </option>
                    ))}
                  </select>

                  {/* Operator */}
                  <select
                    value={filter.operator}
                    onChange={(e) => onUpdateFilter(filter.id, { operator: e.target.value })}
                    className="w-32 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {operators.map(op => (
                      <option key={op} value={op}>{op}</option>
                    ))}
                  </select>

                  {/* Value */}
                  {!['IS NULL', 'IS NOT NULL'].includes(filter.operator) && (
                    <input
                      type="text"
                      value={filter.value}
                      onChange={(e) => onUpdateFilter(filter.id, { value: e.target.value })}
                      placeholder="Value"
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  )}

                  {/* Remove */}
                  <button
                    onClick={() => onRemoveFilter(filter.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
