import { Sparkles, Code, History, Zap } from 'lucide-react';
import { Button } from '../common/Button';

export function ConnectAnywhereStep({ onNext }) {
  return (
    <div className="flex items-center gap-8 py-8 px-6">
      {/* Screenshot - Left Side */}
      <div className="flex-1 rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
        <img 
          src="/assets/editor.png" 
          alt="Query Editor" 
          className="w-full h-auto"
        />
      </div>

      {/* Content - Right Side */}
      <div className="flex-1 flex flex-col items-start text-left space-y-6">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
          AI-Powered Query Editor
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Write, execute, and optimize SQL queries with intelligent assistance.
        </p>

        {/* Key Features */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
            <Sparkles className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
            <span className="text-base">AI assistant for query generation and optimization</span>
          </div>
          <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
            <Code className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
            <span className="text-base">Syntax highlighting & intelligent auto-complete</span>
          </div>
          <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
            <History className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
            <span className="text-base">Multiple tabs & query history</span>
          </div>
          <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
            <Zap className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
            <span className="text-base">Execute queries with one click</span>
          </div>
        </div>

        <Button onClick={onNext} className="mt-4 px-10 py-3 text-base">
          Next
        </Button>
      </div>
    </div>
  );
}
