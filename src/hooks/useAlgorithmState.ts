import { useState, useEffect, useCallback } from 'react';
import { AlgorithmStep, KEYBOARD_SHORTCUTS } from '../types';
import {
  navigatePrevious,
  navigateNext,
  togglePlayPause,
  canNavigatePrevious,
  canNavigateNext,
} from '../utils/stepNavigation';

interface UseAlgorithmStateOptions {
  steps: AlgorithmStep[];
  playbackSpeed?: number;
}

export function useAlgorithmState({ steps, playbackSpeed = 1000 }: UseAlgorithmStateOptions) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex];

  const handlePrevious = useCallback(() => {
    setCurrentStepIndex((prev) =>
      navigatePrevious({ currentStep: prev, totalSteps, isPlaying })
    );
  }, [totalSteps, isPlaying]);

  const handleNext = useCallback(() => {
    setCurrentStepIndex((prev) =>
      navigateNext({ currentStep: prev, totalSteps, isPlaying })
    );
  }, [totalSteps, isPlaying]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => togglePlayPause(prev));
  }, []);

  const handleSeek = useCallback((step: number) => {
    const clampedStep = Math.max(0, Math.min(totalSteps - 1, step));
    setCurrentStepIndex(clampedStep);
  }, [totalSteps]);

  const handleReset = useCallback(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, []);

  const canGoPrevious = canNavigatePrevious({
    currentStep: currentStepIndex,
    totalSteps,
    isPlaying,
  });

  const canGoNext = canNavigateNext({
    currentStep: currentStepIndex,
    totalSteps,
    isPlaying,
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const shortcut = KEYBOARD_SHORTCUTS.find((s) => s.key === e.key);
      if (!shortcut) return;

      e.preventDefault();
      switch (shortcut.action) {
        case 'previous':
          handlePrevious();
          break;
        case 'next':
          handleNext();
          break;
        case 'playPause':
          handlePlayPause();
          break;
        case 'reset':
          handleReset();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevious, handleNext, handlePlayPause, handleReset]);

  // Auto-play
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const next = navigateNext({ currentStep: prev, totalSteps, isPlaying: true });
        if (next === prev) {
          // Reached the end, stop playing
          setIsPlaying(false);
        }
        return next;
      });
    }, playbackSpeed);

    return () => clearInterval(timer);
  }, [isPlaying, totalSteps, playbackSpeed]);

  return {
    currentStep,
    currentStepIndex,
    totalSteps,
    isPlaying,
    canGoPrevious,
    canGoNext,
    handlePrevious,
    handleNext,
    handlePlayPause,
    handleSeek,
    handleReset,
  };
}
