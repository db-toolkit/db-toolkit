/**
 * Table selector sidebar for adding tables to canvas
 */
import { useState } from 'react';
import { Search, Table, Plus } from 'lucide-react';
import { useDebounce } from '../../utils/debounce';

export function TableSelector({ schema, onAddTable, addedTables }) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const allTables = [];
  if (schema?.schemas) {
    Object.entries(schema.schemas).forEach(([schemaName, tables]) => {
      if (Array.isArray(tables)) {
        tables.forEach(table => {
          allTables.push({
            schema: schemaName,
            name: table.name,
            columns: table.columns || []
          });
        });
      }
    });
  }

  const filteredTables = allTables.filter(table =>
    table.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const isAdded = (tableName) => addedTables.includes(tableName);

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Tables</h3>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tables..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filteredTables.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            {searchQuery ? 'No tables found' : 'No tables available'}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredTables.map(table => (
              <button
                key={`${table.schema}.${table.name}`}
                onClick={() => !isAdded(table.name) && onAddTable(table)}
                disabled={isAdded(table.name)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition ${
                  isAdded(table.name)
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Table size={16} />
                <span className="flex-1 text-left">{table.name}</span>
                {!isAdded(table.name) && <Plus size={14} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
