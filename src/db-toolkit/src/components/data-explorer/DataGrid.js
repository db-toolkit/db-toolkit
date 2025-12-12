/**
 * Data grid component for displaying table data
 */
import { useState } from 'react';
import { ChevronUp, ChevronDown, Eye, Check, X, Copy, Filter, FilterX } from 'lucide-react';
import { ContextMenu, useContextMenu } from '../common/ContextMenu';
import { useToast } from '../../contexts/ToastContext';

export function DataGrid({ data, columns, onSort, sortColumn, sortOrder, onCellClick, onCellUpdate, onFilterByValue }) {
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const cellContextMenu = useContextMenu();
  const headerContextMenu = useContextMenu();
  const toast = useToast();

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const handleSort = (column) => {
    const newOrder = sortColumn === column && sortOrder === 'ASC' ? 'DESC' : 'ASC';
    onSort(column, newOrder);
  };

  const isTruncated = (value) => {
    return typeof value === 'string' && value.endsWith('...');
  };

  const startEdit = (rowIndex, colIndex, value) => {
    setEditingCell({ rowIndex, colIndex });
    setEditValue(value !== null ? String(value) : '');
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const saveEdit = async (row, colIndex) => {
    if (!onCellUpdate) {
      cancelEdit();
      return;
    }

    setSaving(true);
    try {
      await onCellUpdate(row, columns[colIndex], editValue);
      cancelEdit();
    } catch (error) {
      console.error('Failed to save cell:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e, row, colIndex) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit(row, colIndex);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        No data available
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                onClick={() => handleSort(column)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  headerContextMenu.open(e, { column, colIndex: columns.indexOf(column) });
                }}
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="flex items-center gap-2">
                  {column}
                  {sortColumn === column && (
                    sortOrder === 'ASC' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              {columns.map((column, colIndex) => {
                const value = row[colIndex];
                const truncated = isTruncated(value);
                const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.colIndex === colIndex;
                
                return (
                  <td
                    key={colIndex}
                    className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap group relative"
                    onDoubleClick={() => onCellUpdate && startEdit(rowIndex, colIndex, value)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      cellContextMenu.open(e, { row, rowIndex, column, colIndex, value });
                    }}
                  >
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, row, colIndex)}
                          onBlur={() => !saving && cancelEdit()}
                          autoFocus
                          disabled={saving}
                          className="w-full px-2 py-1 border border-green-500 dark:border-green-400 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                        />
                        <button
                          onClick={() => saveEdit(row, colIndex)}
                          disabled={saving}
                          className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 disabled:opacity-50"
                          title="Save (Enter)"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={saving}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 disabled:opacity-50"
                          title="Cancel (Esc)"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {value !== null ? String(value) : <span className="text-gray-400">NULL</span>}
                        {truncated && (
                          <button
                            onClick={() => onCellClick(row, column, colIndex)}
                            className="opacity-0 group-hover:opacity-100 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                            title="View full content"
                          >
                            <Eye size={14} />
                          </button>
                        )}
                        {onCellUpdate && (
                          <span className="opacity-0 group-hover:opacity-100 text-xs text-gray-500 dark:text-gray-400">
                            (double-click to edit)
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <ContextMenu
        isOpen={cellContextMenu.isOpen}
        position={cellContextMenu.position}
        onClose={cellContextMenu.close}
        items={cellContextMenu.data ? [
          {
            label: 'Copy Cell Value',
            icon: <Copy size={16} />,
            onClick: () => copyToClipboard(String(cellContextMenu.data.value || ''))
          },
          {
            label: 'Copy Row as JSON',
            icon: <Copy size={16} />,
            onClick: () => {
              const rowObj = {};
              columns.forEach((col, idx) => {
                rowObj[col] = cellContextMenu.data.row[idx];
              });
              copyToClipboard(JSON.stringify(rowObj, null, 2));
            }
          },
          { separator: true },
          {
            label: 'Filter by Value',
            icon: <Filter size={16} />,
            onClick: () => onFilterByValue?.(cellContextMenu.data.column, cellContextMenu.data.value),
            disabled: !onFilterByValue
          },
          {
            label: 'Exclude Value',
            icon: <FilterX size={16} />,
            onClick: () => onFilterByValue?.(cellContextMenu.data.column, cellContextMenu.data.value, true),
            disabled: !onFilterByValue
          },
          { separator: true },
          {
            label: 'Edit Cell',
            icon: <Check size={16} />,
            onClick: () => startEdit(cellContextMenu.data.rowIndex, cellContextMenu.data.colIndex, cellContextMenu.data.value),
            disabled: !onCellUpdate
          },
          {
            label: 'View Full Content',
            icon: <Eye size={16} />,
            onClick: () => onCellClick(cellContextMenu.data.row, cellContextMenu.data.column, cellContextMenu.data.colIndex),
            disabled: !isTruncated(cellContextMenu.data.value)
          }
        ] : []}
      />

      <ContextMenu
        isOpen={headerContextMenu.isOpen}
        position={headerContextMenu.position}
        onClose={headerContextMenu.close}
        items={headerContextMenu.data ? [
          {
            label: 'Sort Ascending',
            icon: <ChevronUp size={16} />,
            onClick: () => onSort(headerContextMenu.data.column, 'ASC')
          },
          {
            label: 'Sort Descending',
            icon: <ChevronDown size={16} />,
            onClick: () => onSort(headerContextMenu.data.column, 'DESC')
          },
          { separator: true },
          {
            label: 'Copy Column Name',
            icon: <Copy size={16} />,
            onClick: () => copyToClipboard(headerContextMenu.data.column)
          },
          {
            label: 'Copy All Values',
            icon: <Copy size={16} />,
            onClick: () => {
              const values = data.map(row => row[headerContextMenu.data.colIndex]).join('\n');
              copyToClipboard(values);
            }
          }
        ] : []}
      />
    </div>
  );
}
