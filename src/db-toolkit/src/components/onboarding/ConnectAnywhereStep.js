import { Code, Zap, Lock, BarChart3 } from 'lucide-react';
import { Button } from '../common/Button';

export function ConnectAnywhereStep({ onNext }) {
  const features = [
    {
      icon: Code,
      title: 'Query Editor',
      description: 'AI assistant, syntax highlighting, autocomplete, and query analytics.',
      color: 'bg-blue-500'
    },
    {
      icon: Zap,
      title: 'Data Explorer',
      description: 'Browse, edit, and manage data with inline editing and CSV/JSON export.',
      color: 'bg-purple-500'
    },
    {
      icon: Lock,
      title: 'Automated Backups',
      description: 'Schedule backups with retention policies and one-click restore.',
      color: 'bg-green-500'
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Monitor performance with live metrics and query insights.',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="flex flex-col items-center py-8 px-6">
      <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 text-center">
        Powerful Features
      </h2>
      <p className="text-base text-gray-600 dark:text-gray-400 mb-10 text-center max-w-2xl">
        Everything you need to manage your databases efficiently
      </p>

      {/* Feature Grid */}
      <div className="grid grid-cols-2 gap-6 w-full max-w-3xl mb-8">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
          >
            <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <Button onClick={onNext} className="px-10 py-3 text-base">
        Next
      </Button>
    </div>
  );
}
