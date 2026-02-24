/**
 * Connection selector for Data Explorer
 */
import { memo, useState, useMemo } from 'react';

import { Database, Search, Filter } from 'lucide-react';
import { Button } from '../common/Button';
import { SearchBar } from '../common/SearchBar';
import { useSearch } from '../../hooks/common/useSearch';
import { useGroups } from '../../hooks/groups/useGroups';

export const ConnectionSelector = memo(function ConnectionSelector({ 
  connections, 
  connecting, 
  onConnect,
  title = "Data Explorer",
  description = "Select a connection to explore data",
  buttonText = "Connect & Explore"
}) {
  const { groups } = useGroups();
  const [selectedGroup, setSelectedGroup] = useState('all');

  const filteredByGroup = useMemo(() => {
    if (selectedGroup === 'all') return connections;
    if (selectedGroup === 'ungrouped') return connections.filter(c => !c.group);
    return connections.filter(c => c.group === selectedGroup);
  }, [connections, selectedGroup]);

  const { searchQuery, setSearchQuery, filteredItems, clearSearch, hasResults, isSearching } = useSearch(
    filteredByGroup,
    ['name', 'db_type', 'host', 'database']
  );

  return (
    <div className="p-8 animate-page-transition">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
      
      {connections.length > 0 && (
        <div className="flex gap-3 mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={clearSearch}
            placeholder="Search connections..."
            className="flex-1"
          />
          <div className="relative w-48">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer"
            >
              <option value="all">All Groups</option>
              <option value="ungrouped">Ungrouped</option>
              {groups.map(group => (
                <option key={group.id} value={group.name}>{group.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {!hasResults && isSearching ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          <Search size={48} className="mb-4 opacity-50" />
          <p className="text-lg">No connections found matching "{searchQuery}"</p>
        </div>
      ) : !hasResults && selectedGroup !== 'all' ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          <Filter size={48} className="mb-4 opacity-50" />
          <p className="text-lg">No connections in this group</p>
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
