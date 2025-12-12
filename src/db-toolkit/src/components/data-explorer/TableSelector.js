/**
 * Table selector component
 */
import { useState } from 'react';
import { Database, Table, Search } from 'lucide-react';
import { useDebounce } from '../../utils/debounce';
import { ContextMenu, useContextMenu } from '../common/ContextMenu';
import { getTableContextMenuItems } from '../../utils/contextMenuActions';
import { useToast } from '../../contexts/ToastContext';

export function TableSelector({ schema, selectedTable, onSelectTable, onRefreshTable }) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const contextMenu = useContextMenu();
  const toast = useToast();

  if (!schema?.schemas) {
    return (
      <div className="p-4 text-gray-500 dark:text-gray-400 text-sm">
        No schema loaded
      </div>
    );
  }

  const filterTables = (tables) => {
    if (!debouncedSearch) return tables;
    return tables.filter(name => 
      name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tables..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
      <div className="overflow-y-auto flex-1">
        {Object.entries(schema.schemas).map(([schemaName, schemaData]) => {
          const tables = schemaData.tables ? Object.keys(schemaData.tables) : [];
          const filteredTables = filterTables(tables);
          
          if (filteredTables.length === 0) return null;
          
          return (
            <div key={schemaName} className="mb-4">
              <div className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Database size={16} />
                {schemaName}
              </div>
              {filteredTables.map((tableName) => {
                const tableData = schemaData.tables?.[tableName];
                return (
                  <button
                    key={tableName}
                    onClick={() => onSelectTable(schemaName, tableName)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      contextMenu.open(e, { schemaName, tableName, tableData });
                    }}
                    className={`w-full flex items-center gap-2 px-6 py-2 text-sm transition ${
                      selectedTable?.schema === schemaName && selectedTable?.table === tableName
                        ? 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Table size={14} />
                    {tableName}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
      
      <ContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        onClose={contextMenu.close}
        items={contextMenu.data ? getTableContextMenuItems({
          schemaName: contextMenu.data.schemaName,
          tableName: contextMenu.data.tableName,
          tableData: contextMenu.data.tableData,
          onRefresh: onRefreshTable,
          onDrop: null,
          toast
        }) : []}
      />
    </div>
  );
}
