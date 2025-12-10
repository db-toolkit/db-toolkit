/**
 * Current queries table
 */
import { XCircle, Eye } from 'lucide-react';
import { Button } from '../common/Button';

export function CurrentQueries({ queries, onKill, onViewPlan }) {
  if (!queries || queries.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Current Queries</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">No active queries</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Current Queries ({queries.length})
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">PID</th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">User</th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Type</th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Duration</th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Query</th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((query, index) => (
              <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{query.pid}</td>
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{query.usename || 'N/A'}</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 text-xs rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    {query.query_type || 'N/A'}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                  {query.duration ? `${query.duration.toFixed(1)}s` : 'N/A'}
                </td>
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100 max-w-md truncate font-mono text-xs">
                  {query.query}
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<Eye size={14} />}
                      onClick={() => onViewPlan(query.query)}
                    >
                      Plan
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={<XCircle size={14} />}
                      onClick={() => onKill(query.pid)}
                    >
                      Kill
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
