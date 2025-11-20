import { memo } from 'react';

interface StepIndicatorProps {
  number: number;
  active?: boolean;
}

function StepIndicator({ number, active = true }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
        active 
          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' 
          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
      }`}>
        {number}
      </div>
      <div className="h-0.5 w-8 bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}

export default memo(StepIndicator);
