import { Database, Trash2, Play, Circle, Edit } from 'lucide-react';
import { Button } from '../common/Button';

export function ConnectionCard({ connection, onConnect, onDelete, onEdit, isActive }) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-lg hover:border-green-400 dark:hover:border-green-500 transition-all duration-200 cursor-pointer">
      <div className="flex items-start gap-3 mb-4">
        <Database className="text-green-600 dark:text-green-400 mt-1" size={24} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{connection.name}</h3>
            <Circle
              size={8}
              className={isActive ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{connection.db_type}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {connection.db_type === 'sqlite' ? connection.database.split('/').pop() : `${connection.host}:${connection.port}`}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="success"
          size="sm"
          icon={<Play size={16} />}
          onClick={() => onConnect(connection.id)}
          className="flex-1 !text-white"
        >
          Connect
        </Button>
        <Button
          variant="secondary"
          size="sm"
          icon={<Edit size={16} />}
          onClick={() => onEdit(connection)}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(connection.id)}
          className="!px-2"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
}
