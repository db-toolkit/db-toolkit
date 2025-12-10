/**
 * Blocked queries table
 */
import { Lock } from 'lucide-react';

export function BlockedQueries({ queries }) {
  if (!queries || queries.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Lock size={20} />
          Blocked Queries
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">No blocked queries</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <Lock size={20} />
        Blocked Queries ({queries.length})
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Blocked PID</th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Blocked User</th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Blocking PID</th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Blocking User</th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Blocked Query</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((query, index) => (
              <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{query.blocked_pid}</td>
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{query.blocked_user || 'N/A'}</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 text-xs rounded bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                    {query.blocking_pid}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{query.blocking_user || 'N/A'}</td>
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100 max-w-md truncate font-mono text-xs">
                  {query.blocked_query}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
