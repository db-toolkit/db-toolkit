/**
 * Connection selector for Data Explorer
 */
import { memo } from 'react';

import { Database, Search } from 'lucide-react';
import { Button } from '../common/Button';
import { SearchBar } from '../common/SearchBar';
import { useSearch } from '../../hooks/common/useSearch';

export const ConnectionSelector = memo(function ConnectionSelector({ 
  connections, 
  connecting, 
  onConnect,
  title = "Data Explorer",
  description = "Select a connection to explore data",
  buttonText = "Connect & Explore"
}) {
  const { searchQuery, setSearchQuery, filteredItems, clearSearch, hasResults, isSearching } = useSearch(
    connections,
    ['name', 'db_type', 'host', 'database']
  );

  return (
    <div className="p-8 animate-page-transition">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
      
      {connections.length > 0 && (
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={clearSearch}
          placeholder="Search connections..."
          className="mb-6"
        />
      )}

      {!hasResults && isSearching ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          <Search size={48} className="mb-4 opacity-50" />
          <p className="text-lg">No connections found matching "{searchQuery}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((conn) => (
            <div
              key={conn.id}
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-lg hover:border-green-400 dark:hover:border-green-500 transition-all duration-200 h-[160px] flex flex-col"
            >
              <div className="flex items-start gap-3 mb-4 flex-1">
                <Database className="text-green-600 dark:text-green-400 mt-1" size={24} />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{conn.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{conn.db_type}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 truncate">
                    {conn.db_type === 'sqlite' ? conn.database.split('/').pop() : `${conn.host}:${conn.port}`}
                  </p>
                </div>
              </div>
              <Button
                variant="success"
                size="sm"
                onClick={() => onConnect(conn.id)}
                disabled={connecting === conn.id}
                className="w-full !text-white"
              >
                {connecting === conn.id ? 'Connecting...' : buttonText}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
