import { Code, Zap, Lock, BarChart3, Database, Layers } from 'lucide-react';
import { Button } from '../common/Button';

export function FeaturesStep({ onNext }) {
  const features = [
    {
      icon: Code,
      title: 'Query Editor',
      description: 'AI assistant, syntax highlighting, autocomplete, and query analytics.',
      color: 'text-blue-500'
    },
    {
      icon: Zap,
      title: 'Data Explorer',
      description: 'Browse, edit, and manage data with inline editing and CSV/JSON export.',
      color: 'text-purple-500'
    },
    {
      icon: Database,
      title: 'Schema Explorer',
      description: 'Browse table structures, columns, indexes, and relationships visually.',
      color: 'text-cyan-500'
    },
    {
      icon: Lock,
      title: 'Automated Backups',
      description: 'Schedule backups with retention policies and one-click restore.',
      color: 'text-green-500'
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Monitor performance with live metrics and query insights.',
      color: 'text-orange-500'
    },
    {
      icon: Layers,
      title: 'Workspaces',
      description: 'Multiple isolated workspace tabs for working with different databases.',
      color: 'text-indigo-500'
    }
  ];

  return (
    <div className="flex flex-col h-full w-full py-4 px-6">
      {/* Feature List */}
      <div className="flex-1 space-y-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <feature.icon className={`w-6 h-6 ${feature.color} mt-1 flex-shrink-0`} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Next button - bottom right */}
      <div className="flex justify-end mt-6">
        <Button onClick={onNext} className="px-10 py-3 text-base">
          Next
        </Button>
      </div>
    </div>
  );
}
