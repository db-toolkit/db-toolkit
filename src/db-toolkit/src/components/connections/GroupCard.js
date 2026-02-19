import { Users } from 'lucide-react';

export function GroupCard({ group, connectionCount, onDoubleClick }) {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-green-300 dark:hover:border-green-600 transition-all cursor-pointer h-32 flex flex-col justify-between"
      onDoubleClick={() => onDoubleClick(group.name)}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-sm">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
            {group.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {connectionCount} connection{connectionCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
      
      <div className="flex justify-center pb-2">
        <span className="text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
          Double-click to open
        </span>
      </div>
    </div>
  );
}
