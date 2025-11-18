import { useState } from 'react';
import { ChevronRight, ChevronDown, Database, Table, Columns } from 'lucide-react';

export function SchemaTree({ schema, onTableClick }) {
  const [expanded, setExpanded] = useState({});

  const toggle = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!schema) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      {Object.entries(schema).map(([schemaName, tables]) => (
        <div key={schemaName} className="mb-2">
          <div
            className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
            onClick={() => toggle(schemaName)}
          >
            {expanded[schemaName] ? <ChevronDown size={16} className="text-gray-600 dark:text-gray-400" /> : <ChevronRight size={16} className="text-gray-600 dark:text-gray-400" />}
            <Database size={16} className="text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-gray-900 dark:text-gray-100">{schemaName}</span>
          </div>

          {expanded[schemaName] && (
            <div className="ml-6">
              {tables.map((table) => (
                <div
                  key={table}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                  onClick={() => onTableClick(schemaName, table)}
                >
                  <Table size={16} className="text-green-600 dark:text-green-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{table}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
