/**
 * Table node component for visual query builder
 */
import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Table, Check, X } from 'lucide-react';

function QueryTableNode({ data, selected }) {
  const { tableName, columns = [], selectedColumns = [], onColumnToggle, onRemove } = data;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg min-w-[280px] border-2 ${
      selected ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'
    }`}>
      {/* Header */}
      <div className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-3 rounded-t-lg flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Table size={18} />
          <span className="font-semibold">{tableName}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.(tableName);
          }}
          className="p-1 hover:bg-blue-500 dark:hover:bg-blue-600 rounded transition"
          title="Remove table"
        >
          <X size={16} />
        </button>
      </div>

      {/* Columns */}
      <div className="p-2 max-h-[400px] overflow-y-auto">
        {columns.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400 italic p-2">
            No columns
          </div>
        ) : (
          <div className="space-y-1">
            {columns.map((column) => {
              const isSelected = selectedColumns.includes(`${tableName}.${column.name}`);
              
              return (
                <button
                  key={column.name}
                  onClick={() => onColumnToggle?.(tableName, column)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition ${
                    isSelected
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {isSelected && <Check size={12} className="text-white" />}
                  </div>
                  <span className="flex-1 text-left font-medium">{column.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {column.data_type || column.type}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Connection Handles */}
      <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-blue-500" />
      <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-blue-500" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-blue-500" />
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-blue-500" />
    </div>
  );
}

export default memo(QueryTableNode);
