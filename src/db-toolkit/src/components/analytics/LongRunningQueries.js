/**
 * Long-running queries table
 */
import { XCircle, Clock } from 'lucide-react';
import { Button } from '../common/Button';

export function LongRunningQueries({ queries, onKill }) {
  if (!queries || queries.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Clock size={20} />
          Long-Running Queries
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">No long-running queries</p>
      </div>
    );
  }

  const formatDuration = (seconds) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <Clock size={20} />
        Long-Running Queries ({queries.length})
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">PID</th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">User</th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Duration</th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Query</th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((query, index) => (
              <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{query.pid}</td>
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{query.usename || 'N/A'}</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 text-xs rounded bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">
                    {formatDuration(query.duration)}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100 max-w-md truncate font-mono text-xs">
                  {query.query}
                </td>
                <td className="px-4 py-2">
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<XCircle size={14} />}
                    onClick={() => onKill(query.pid)}
                  >
                    Kill
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
