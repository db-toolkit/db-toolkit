import { Database } from 'lucide-react';
import { Button } from '../common/Button';

export function WelcomeStep({ onNext }) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
      <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center">
        <Database className="w-12 h-12 text-white" />
      </div>
      
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome to DB Toolkit
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md">
          Your All-in-One Database Manager
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 max-w-md">
          Connect to PostgreSQL, MySQL, MongoDB, and more
        </p>
      </div>

      <Button onClick={onNext} className="mt-8 px-8 py-3 text-lg">
        Get Started
      </Button>
    </div>
  );
}
