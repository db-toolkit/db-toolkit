import { Users } from 'lucide-react';

export function GroupCard({ group, connectionCount, onDoubleClick }) {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow cursor-pointer h-24 flex items-center justify-between"
      onDoubleClick={() => onDoubleClick(group.name)}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">
            {group.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {connectionCount} connection{connectionCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
      <div className="text-xs text-gray-400 dark:text-gray-500">
        Double-click to open
      </div>
    </div>
  );
}
