/**
 * Step navigation utilities for algorithm visualization
 */

export interface NavigationState {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
}

/**
 * Navigate to the previous step
 * Returns the new step index, clamped to valid bounds
 */
export function navigatePrevious(state: NavigationState): number {
  // First clamp current step to valid range, then navigate
  const clampedCurrent = clampStep(state.currentStep, state.totalSteps);
  return Math.max(0, clampedCurrent - 1);
}

/**
 * Navigate to the next step
 * Returns the new step index, clamped to valid bounds
 */
export function navigateNext(state: NavigationState): number {
  // First clamp current step to valid range, then navigate
  const clampedCurrent = clampStep(state.currentStep, state.totalSteps);
  return Math.min(state.totalSteps - 1, clampedCurrent + 1);
}

/**
 * Toggle play/pause state
 */
export function togglePlayPause(isPlaying: boolean): boolean {
  return !isPlaying;
}

/**
 * Check if previous navigation is possible
 */
export function canNavigatePrevious(state: NavigationState): boolean {
  return state.currentStep > 0;
}

/**
 * Check if next navigation is possible
 */
export function canNavigateNext(state: NavigationState): boolean {
  return state.currentStep < state.totalSteps - 1;
}

/**
 * Clamp step to valid bounds
 */
export function clampStep(step: number, totalSteps: number): number {
  return Math.max(0, Math.min(totalSteps - 1, step));
}
