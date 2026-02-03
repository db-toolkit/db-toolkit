import { CheckCircle, Database } from 'lucide-react';
import { Button } from '../common/Button';

export function PowerfulFeaturesStep({ onComplete }) {
  const databases = [
    { name: 'PostgreSQL', color: 'bg-blue-500' },
    { name: 'MySQL', color: 'bg-orange-500' },
    { name: 'MongoDB', color: 'bg-green-500' },
    { name: 'SQLite', color: 'bg-gray-500' }
  ];

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 py-12 h-full">
      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
        <CheckCircle className="w-12 h-12 text-white" />
      </div>

      <div className="space-y-4">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
          You're All Set!
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg">
          Create your first connection to get started
        </p>
      </div>

      {/* Supported Databases */}
      <div className="space-y-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">Supports</p>
        <div className="flex gap-3">
          {databases.map((db) => (
            <div
              key={db.name}
              className={`px-4 py-2 ${db.color} rounded-lg flex items-center gap-2`}
            >
              <Database className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">{db.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
