import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

const tourSteps = [
  {
    target: 'overview',
    title: 'Welcome to DB Toolkit',
    content: 'A modern database management application. Let\'s take a quick tour to get you started.',
    position: 'center'
  },
  {
    target: 'connections',
    title: 'Manage Connections',
    content: 'Create and manage database connections. Support for PostgreSQL, MySQL, SQLite, and MongoDB.',
    position: 'right'
  },
  {
    target: 'query-editor',
    title: 'Query Editor',
    content: 'Write and execute SQL queries with syntax highlighting, auto-completion, and AI-powered explanations.',
    position: 'right'
  },
  {
    target: 'data-explorer',
    title: 'Data Explorer',
    content: 'Browse, edit, and manage your data with inline editing, CSV import/export, and advanced filtering.',
    position: 'right'
  },
  {
    target: 'backups',
    title: 'Backups & Restore',
    content: 'Schedule automated backups, create manual backups, and restore your databases with ease.',
    position: 'right'
  },
  {
    target: 'command-palette',
    title: 'Command Palette',
    content: 'Press Ctrl+K (Cmd+K on Mac) to quickly search and navigate anywhere in the app.',
    position: 'center'
  }
];

export function OnboardingTour({ isOpen, onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = tourSteps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === tourSteps.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            {tourSteps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep
                    ? 'w-8 bg-green-600'
                    : idx < currentStep
                    ? 'w-2 bg-green-400'
                    : 'w-2 bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {step.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {step.content}
          </p>

          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Skip tour
            </button>

            <div className="flex gap-2">
              {!isFirst && (
                <Button variant="secondary" onClick={handlePrev}>
                  <ChevronLeft size={16} className="mr-1" /> Back
                </Button>
              )}
              <Button onClick={handleNext}>
                {isLast ? 'Get Started' : 'Next'} {!isLast && <ChevronRight size={16} className="ml-1" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="px-6 pb-4 text-center text-xs text-gray-500 dark:text-gray-400">
          Step {currentStep + 1} of {tourSteps.length}
        </div>
      </div>
    </div>
  );
}
