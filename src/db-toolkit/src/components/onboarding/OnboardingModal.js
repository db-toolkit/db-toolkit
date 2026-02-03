import { useState } from 'react';
import { WelcomeStep } from './WelcomeStep';
import { FeaturesStep } from './FeaturesStep';
import { ReadyToStartStep } from './ReadyToStartStep';
import { onboardingUtils } from '../../utils/onboarding';

export function OnboardingModal({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { component: WelcomeStep },
    { component: FeaturesStep },
    { component: ReadyToStartStep }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    onboardingUtils.markCompleted();
    onComplete();
  };

  const handleComplete = () => {
    onboardingUtils.markCompleted();
    onComplete();
  };

  const handleStepClick = (index) => {
    setCurrentStep(index);
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full mx-4 relative border-2 border-gray-300 dark:border-gray-700">
        {/* Step content - Fixed height */}
        <div className="px-8 py-6 h-[500px] flex items-center justify-center">
          <CurrentStepComponent
            onNext={handleNext}
            onComplete={handleComplete}
          />
        </div>

        {/* Progress indicator and Skip button */}
        <div className="flex items-center justify-between px-8 pb-6">
          <button
            onClick={handleSkip}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Skip
          </button>
          
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => handleStepClick(index)}
                className={`h-2 rounded-full transition-all cursor-pointer hover:opacity-80 ${
                  index === currentStep
                    ? 'w-8 bg-green-500'
                    : 'w-2 bg-gray-300 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
          
          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
            >
              Create Connection
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
