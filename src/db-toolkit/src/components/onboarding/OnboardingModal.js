import { useState } from 'react';
import { X } from 'lucide-react';
import { WelcomeStep } from './WelcomeStep';
import { ConnectAnywhereStep } from './ConnectAnywhereStep';
import { PowerfulFeaturesStep } from './PowerfulFeaturesStep';
import { ReadyToStartStep } from './ReadyToStartStep';
import { onboardingUtils } from '../../utils/onboarding';

export function OnboardingModal({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { component: WelcomeStep },
    { component: ConnectAnywhereStep },
    { component: PowerfulFeaturesStep },
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

  const CurrentStepComponent = steps[currentStep].component;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 bg-blue-500 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full mx-4 relative">
        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step content */}
        <div className="px-8 py-6">
          <CurrentStepComponent
            onNext={handleNext}
            onComplete={handleComplete}
          />
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2 pb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'w-8 bg-green-500'
                  : 'w-2 bg-gray-300 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
