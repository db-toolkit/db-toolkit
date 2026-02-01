import { useState } from 'react';
import { Code, Zap, Lock, BarChart3 } from 'lucide-react';
import { Button } from '../common/Button';

export function ConnectAnywhereStep({ onNext }) {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Code,
      title: 'Query Editor',
      description: 'AI assistant, syntax highlighting, autocomplete, and query analytics.',
      image: '/assets/editor.png'
    },
    {
      icon: Zap,
      title: 'Data Explorer',
      description: 'Browse, edit, and manage data with inline editing and CSV/JSON export.',
      image: '/assets/data.png'
    },
    {
      icon: Lock,
      title: 'Automated Backups',
      description: 'Schedule backups with retention policies and one-click restore.',
      image: '/assets/backup.png'
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Monitor performance with live metrics and query insights.',
      image: '/assets/analytics.png'
    }
  ];

  return (
    <div className="flex flex-col py-8 px-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
        Powerful Features
      </h2>
      <p className="text-base text-gray-600 dark:text-gray-400 mb-8 text-center">
        Everything you need to manage your databases efficiently
      </p>

      <div className="flex gap-6">
        {/* Feature Buttons - Left Side */}
        <div className="flex-1 space-y-3">
          {features.map((feature, index) => (
            <button
              key={feature.title}
              onClick={() => setActiveFeature(index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                activeFeature === index
                  ? 'bg-blue-50 dark:bg-gray-800 border-blue-500 dark:border-blue-500 shadow-md'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  activeFeature === index
                    ? 'bg-blue-100 dark:bg-blue-900/30'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <feature.icon className={`w-5 h-5 ${
                    activeFeature === index
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className={`text-base font-semibold mb-1 ${
                    activeFeature === index
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm ${
                    activeFeature === index
                      ? 'text-gray-600 dark:text-gray-300'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Feature Preview - Right Side */}
        <div className="flex-1">
          <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
            <img 
              key={activeFeature}
              src={features[activeFeature].image}
              alt={features[activeFeature].title}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Button onClick={onNext} className="px-10 py-3 text-base">
          Next
        </Button>
      </div>
    </div>
  );
}
