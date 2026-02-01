import { CheckCircle } from 'lucide-react';
import { Button } from '../common/Button';

export function ReadyToStartStep({ onComplete }) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
        <CheckCircle className="w-12 h-12 text-white" />
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          You're All Set!
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400 max-w-lg">
          Create your first connection to get started
        </p>
      </div>

      <Button onClick={onComplete} className="mt-8 px-8">
        Create Connection
      </Button>
    </div>
  );
}
