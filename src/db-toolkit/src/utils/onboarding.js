const ONBOARDING_KEY = 'onboarding_completed';

export const onboardingUtils = {
  isCompleted() {
    return localStorage.getItem(ONBOARDING_KEY) === 'true';
  },

  markCompleted() {
    localStorage.setItem(ONBOARDING_KEY, 'true');
  },

  reset() {
    localStorage.removeItem(ONBOARDING_KEY);
  }
};
