import { Sparkles, Code, Lock } from 'lucide-react';
import { Button } from '../common/Button';

export function WelcomeStep({ onNext }) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 py-8">
      {/* Hero Image */}
      <div className="w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
        <img 
          src="/assets/preview.png" 
          alt="DB Toolkit Preview" 
          className="w-full h-auto"
        />
      </div>

      {/* Key Message */}
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Modern database manager,<br />
          <span className="text-blue-500">free forever</span>,{' '}
          <span className="text-purple-500">AI powered</span>
        </h1>
        
        {/* Value Props */}
        <div className="flex items-center justify-center gap-8 pt-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Lock className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium">Free & Open Source</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium">Modern UI</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Code className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium">AI Assistant</span>
          </div>
        </div>
      </div>

      <Button onClick={onNext} className="mt-6 px-10 py-3 text-base">
        Get Started
      </Button>
    </div>
  );
}
