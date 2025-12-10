/**
 * Table statistics component
 */
import { Table } from 'lucide-react';

export function TableStats({ stats }) {
  if (!stats || stats.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Table size={20} />
          Table Statistics
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">No table statistics available</p>
      </div>
    );
  }

  const formatSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (typeof bytes === 'string') return bytes;
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? `${(bytes / 1024).toFixed(2)} KB` : `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <Table size={20} />
        Table Statistics (Top 20)
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Table</th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Size</th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Rows</th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Indexes</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((table, index) => (
              <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100 font-mono text-xs">
                  {table.tablename || table.table_name || table.collection || 'N/A'}
                </td>
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                  {formatSize(table.size_bytes || table.size)}
                </td>
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                  {(table.row_count || table.n_live_tup || 0).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                  {table.index_count || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
