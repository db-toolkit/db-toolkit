/**
 * Analytics statistics cards
 */
import { Activity, Database } from 'lucide-react';

export function AnalyticsStats({ analytics }) {
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const stats = [
    {
      label: 'Active Connections',
      value: analytics.active_connections,
      icon: Activity,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      label: 'Idle Connections',
      value: analytics.idle_connections,
      icon: Activity,
      color: 'text-gray-600 dark:text-gray-400'
    },
    {
      label: 'Database Size',
      value: formatBytes(analytics.database_size),
      icon: Database,
      color: 'text-green-600 dark:text-green-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {stat.value}
                </p>
              </div>
              <Icon className={`${stat.color}`} size={32} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
