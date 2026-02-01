import { Table, Edit, Download, Filter, RefreshCw } from 'lucide-react';
import { Button } from '../common/Button';

export function PowerfulFeaturesStep({ onNext }) {
  return (
    <div className="flex items-center gap-8 py-8 px-6">
      {/* Screenshot - Left Side */}
      <div className="flex-1 rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
        <img 
          src="/assets/data.png" 
          alt="Data Explorer" 
          className="w-full h-auto"
        />
      </div>

      {/* Content - Right Side */}
      <div className="flex-1 flex flex-col items-start text-left space-y-6">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
          Visual Data Explorer
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Browse, edit, and manage your data with ease.
        </p>

        {/* Key Features */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
            <Edit className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
            <span className="text-base">Inline editing & insert/delete rows</span>
          </div>
          <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
            <Filter className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
            <span className="text-base">Pagination, sorting & filtering</span>
          </div>
          <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
            <Download className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
            <span className="text-base">CSV/JSON export & import</span>
          </div>
          <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
            <Table className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
            <span className="text-base">Cell preview for large data</span>
          </div>
          <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
            <RefreshCw className="w-5 h-5 text-cyan-500 mt-1 flex-shrink-0" />
            <span className="text-base">Real-time data updates</span>
          </div>
        </div>

        <Button onClick={onNext} className="mt-4 px-10 py-3 text-base">
          Next
        </Button>
      </div>
    </div>
  );
}
