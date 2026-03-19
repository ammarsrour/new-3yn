import { useState, useEffect, useCallback } from 'react';

const ONBOARDING_KEY = 'onboarding-state';

interface OnboardingState {
  welcomeDismissed: boolean;
  firstAnalysisCompleted: boolean;
  firstAnalysisCelebrated: boolean;
  advancedFeaturesExplored: boolean;
  totalAnalyses: number;
}

const DEFAULT_STATE: OnboardingState = {
  welcomeDismissed: false,
  firstAnalysisCompleted: false,
  firstAnalysisCelebrated: false,
  advancedFeaturesExplored: false,
  totalAnalyses: 0
};

const getStoredState = (): OnboardingState => {
  try {
    const stored = localStorage.getItem(ONBOARDING_KEY);
    if (stored) {
      return { ...DEFAULT_STATE, ...JSON.parse(stored) };
    }
  } catch {
    // Ignore parse errors
  }
  return DEFAULT_STATE;
};

const saveState = (state: OnboardingState) => {
  localStorage.setItem(ONBOARDING_KEY, JSON.stringify(state));
};

export const useOnboarding = (userId?: string) => {
  const [state, setState] = useState<OnboardingState>(getStoredState);

  // Sync with localStorage
  useEffect(() => {
    saveState(state);
  }, [state]);

  const dismissWelcome = useCallback(() => {
    setState(prev => ({ ...prev, welcomeDismissed: true }));
  }, []);

  const skipWelcome = useCallback(() => {
    setState(prev => ({
      ...prev,
      welcomeDismissed: true
    }));
  }, []);

  const completeFirstAnalysis = useCallback(() => {
    setState(prev => ({
      ...prev,
      firstAnalysisCompleted: true,
      totalAnalyses: prev.totalAnalyses + 1
    }));
  }, []);

  const acknowledgeFirstAnalysis = useCallback(() => {
    setState(prev => ({
      ...prev,
      firstAnalysisCelebrated: true
    }));
  }, []);

  const markAdvancedExplored = useCallback(() => {
    setState(prev => ({
      ...prev,
      advancedFeaturesExplored: true
    }));
  }, []);

  const incrementAnalyses = useCallback(() => {
    setState(prev => ({
      ...prev,
      totalAnalyses: prev.totalAnalyses + 1
    }));
  }, []);

  const resetOnboarding = useCallback(() => {
    setState(DEFAULT_STATE);
    localStorage.removeItem(ONBOARDING_KEY);
  }, []);

  // Computed states
  const isNewUser = !state.welcomeDismissed && state.totalAnalyses === 0;
  const shouldShowWelcome = isNewUser;
  const shouldCelebrateFirstAnalysis =
    state.firstAnalysisCompleted &&
    !state.firstAnalysisCelebrated &&
    state.totalAnalyses === 1;
  const shouldShowAdvancedHints =
    state.totalAnalyses >= 1 &&
    !state.advancedFeaturesExplored;

  return {
    state,
    isNewUser,
    shouldShowWelcome,
    shouldCelebrateFirstAnalysis,
    shouldShowAdvancedHints,
    dismissWelcome,
    skipWelcome,
    completeFirstAnalysis,
    acknowledgeFirstAnalysis,
    markAdvancedExplored,
    incrementAnalyses,
    resetOnboarding
  };
};

export default useOnboarding;
