import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import {
  navigatePrevious,
  navigateNext,
  togglePlayPause,
  canNavigatePrevious,
  canNavigateNext,
  clampStep,
  NavigationState,
} from './stepNavigation';

/**
 * **Feature: random-linked-list-copy-visualizer, Property 1: Step Navigation Consistency**
 * 
 * *For any* algorithm state with currentStep in range [0, totalSteps-1], 
 * navigating forward then backward (or backward then forward) should return 
 * to the original step, and the step value should always remain within valid bounds [0, totalSteps-1].
 * 
 * **Validates: Requirements 2.1, 2.2**
 */
describe('Property 1: Step Navigation Consistency', () => {
  // Arbitrary for valid navigation state
  const validNavigationState = fc.record({
    currentStep: fc.integer({ min: 0, max: 100 }),
    totalSteps: fc.integer({ min: 1, max: 100 }),
    isPlaying: fc.boolean(),
  }).filter(state => state.currentStep < state.totalSteps);

  it('navigating forward then backward returns to original step (when not at bounds)', () => {
    fc.assert(
      fc.property(validNavigationState, (state: NavigationState) => {
        // Only test when not at the last step (can go forward)
        if (state.currentStep >= state.totalSteps - 1) return true;
        
        const afterNext = navigateNext(state);
        const afterPrevious = navigatePrevious({
          ...state,
          currentStep: afterNext,
        });
        
        return afterPrevious === state.currentStep;
      }),
      { numRuns: 100 }
    );
  });

  it('navigating backward then forward returns to original step (when not at bounds)', () => {
    fc.assert(
      fc.property(validNavigationState, (state: NavigationState) => {
        // Only test when not at the first step (can go backward)
        if (state.currentStep <= 0) return true;
        
        const afterPrevious = navigatePrevious(state);
        const afterNext = navigateNext({
          ...state,
          currentStep: afterPrevious,
        });
        
        return afterNext === state.currentStep;
      }),
      { numRuns: 100 }
    );
  });

  it('step value always remains within valid bounds [0, totalSteps-1]', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -100, max: 200 }),
        fc.integer({ min: 1, max: 100 }),
        (currentStep: number, totalSteps: number) => {
          const state: NavigationState = {
            currentStep,
            totalSteps,
            isPlaying: false,
          };
          
          const nextStep = navigateNext(state);
          const prevStep = navigatePrevious(state);
          
          return (
            nextStep >= 0 &&
            nextStep < totalSteps &&
            prevStep >= 0 &&
            prevStep < totalSteps
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('clampStep always returns value within bounds', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -1000, max: 1000 }),
        fc.integer({ min: 1, max: 100 }),
        (step: number, totalSteps: number) => {
          const clamped = clampStep(step, totalSteps);
          return clamped >= 0 && clamped < totalSteps;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('canNavigatePrevious is false only at step 0', () => {
    fc.assert(
      fc.property(validNavigationState, (state: NavigationState) => {
        const canPrev = canNavigatePrevious(state);
        return canPrev === (state.currentStep > 0);
      }),
      { numRuns: 100 }
    );
  });

  it('canNavigateNext is false only at last step', () => {
    fc.assert(
      fc.property(validNavigationState, (state: NavigationState) => {
        const canNext = canNavigateNext(state);
        return canNext === (state.currentStep < state.totalSteps - 1);
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * **Feature: random-linked-list-copy-visualizer, Property 2: Play/Pause Toggle Idempotence**
 * 
 * *For any* playing state (true or false), toggling the play/pause state twice 
 * should return to the original state.
 * 
 * **Validates: Requirements 2.3**
 */
describe('Property 2: Play/Pause Toggle Idempotence', () => {
  it('toggling play/pause twice returns to original state', () => {
    fc.assert(
      fc.property(fc.boolean(), (isPlaying: boolean) => {
        const afterFirstToggle = togglePlayPause(isPlaying);
        const afterSecondToggle = togglePlayPause(afterFirstToggle);
        return afterSecondToggle === isPlaying;
      }),
      { numRuns: 100 }
    );
  });

  it('toggle always changes the state', () => {
    fc.assert(
      fc.property(fc.boolean(), (isPlaying: boolean) => {
        const afterToggle = togglePlayPause(isPlaying);
        return afterToggle !== isPlaying;
      }),
      { numRuns: 100 }
    );
  });
});
