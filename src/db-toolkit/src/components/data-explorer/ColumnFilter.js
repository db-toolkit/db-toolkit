/**
 * Column filter component
 */
import { X } from 'lucide-react';

export function ColumnFilter({ columns, filters, onFilterChange, onClearFilters }) {
  const hasFilters = Object.values(filters).some(v => v);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filters</h4>
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs text-green-600 dark:text-green-400 hover:underline flex items-center gap-1"
          >
            <X size={12} />
            Clear All
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {columns.map((column) => (
          <div key={column}>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
              {column}
            </label>
            <input
              type="text"
              value={filters[column] || ''}
              onChange={(e) => onFilterChange(column, e.target.value)}
              placeholder="Filter..."
              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
