/**
 * Connection pool statistics
 */
import { Activity } from 'lucide-react';

export function ConnectionPoolStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <Activity size={20} />
        Connection Pool Statistics
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Current</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {Math.round(stats.current_connections)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Average</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.avg_connections.toFixed(1)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Peak</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {Math.round(stats.max_connections)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Minimum</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {Math.round(stats.min_connections)}
          </p>
        </div>
      </div>
    </div>
  );
}
