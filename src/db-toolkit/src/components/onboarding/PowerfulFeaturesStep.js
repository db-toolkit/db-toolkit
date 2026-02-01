import { Code, Table, Database, Save } from 'lucide-react';
import { Button } from '../common/Button';

export function PowerfulFeaturesStep({ onNext }) {
  const features = [
    { icon: Code, label: 'Query Editor', desc: 'AI-powered SQL assistant' },
    { icon: Table, label: 'Data Explorer', desc: 'Visual data management' },
    { icon: Database, label: 'Schema Viewer', desc: 'Explore table structures' },
    { icon: Save, label: 'Backup Tools', desc: 'Secure data backups' }
  ];

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
      <div className="grid grid-cols-2 gap-4 max-w-lg">
        {features.map(({ icon: Icon, label, desc }) => (
          <div
            key={label}
            className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2"
          >
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mx-auto">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              {label}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Powerful Features
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400 max-w-lg">
          Query, explore, and manage your data with ease
        </p>
      </div>

      <Button onClick={onNext} className="mt-8 px-8">
        Next
      </Button>
    </div>
  );
}
