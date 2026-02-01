import { Database, Shield } from 'lucide-react';
import { Button } from '../common/Button';

export function ConnectAnywhereStep({ onNext }) {
  const databases = [
    { name: 'PostgreSQL', color: 'bg-blue-500' },
    { name: 'MySQL', color: 'bg-orange-500' },
    { name: 'MongoDB', color: 'bg-green-500' },
    { name: 'SQLite', color: 'bg-gray-500' }
  ];

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
      <div className="flex gap-3">
        {databases.map((db) => (
          <div
            key={db.name}
            className={`w-14 h-14 ${db.color} rounded-lg flex items-center justify-center`}
          >
            <Database className="w-8 h-8 text-white" />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Connect to Any Database
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400 max-w-lg">
          PostgreSQL, MySQL, MongoDB, SQLite - all in one place
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-500">
          <Shield className="w-4 h-4" />
          <span>SSL support included</span>
        </div>
      </div>

      <Button onClick={onNext} className="mt-8 px-8">
        Next
      </Button>
    </div>
  );
}
