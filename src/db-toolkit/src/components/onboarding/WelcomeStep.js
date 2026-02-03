import { Sparkles, Code, Lock } from 'lucide-react';
import { Button } from '../common/Button';

export function WelcomeStep({ onNext }) {
  return (
    <div className="flex items-center gap-8 py-8 px-6">
      {/* Hero Image - Left Side */}
      <div className="flex-1 rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
        <img 
          src="/assets/preview.png" 
          alt="DB Toolkit Preview" 
          className="w-full h-auto"
        />
      </div>

      {/* Content - Right Side */}
      <div className="flex-1 flex flex-col items-start text-left space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Modern database manager,<br />
          <span className="text-blue-500">free forever.</span>
        </h1>
        
        {/* Value Props */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <Lock className="w-5 h-5 text-green-500" />
            <span className="text-base font-medium">Free & Open Source</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span className="text-base font-medium">Modern UI</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <Code className="w-5 h-5 text-blue-500" />
            <span className="text-base font-medium">AI Assistant</span>
          </div>
        </div>

        <Button onClick={onNext} className="mt-4 px-10 py-3 text-base">
          View Features
        </Button>
      </div>
    </div>
  );
}
