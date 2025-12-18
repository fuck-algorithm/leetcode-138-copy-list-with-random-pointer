import { useRef, useCallback } from 'react';
import './StepController.css';

interface StepControllerProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onPlayPause: () => void;
  onSeek?: (step: number) => void;
  onReset?: () => void;
}

export function StepController({
  currentStep,
  totalSteps,
  isPlaying,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  onPlayPause,
  onSeek,
  onReset,
}: StepControllerProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const progress = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  const calculateStepFromPosition = useCallback(
    (clientX: number): number => {
      if (!progressBarRef.current) return currentStep;
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      return Math.round(percentage * (totalSteps - 1));
    },
    [currentStep, totalSteps]
  );

  const handleProgressBarClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!onSeek) return;
      onSeek(calculateStepFromPosition(e.clientX));
    },
    [calculateStepFromPosition, onSeek]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!onSeek) return;
      e.preventDefault();
      isDraggingRef.current = true;
      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!isDraggingRef.current) return;
        onSeek(calculateStepFromPosition(moveEvent.clientX));
      };
      const handleMouseUp = () => {
        isDraggingRef.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [calculateStepFromPosition, onSeek]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!onSeek) return;
      let newStep = currentStep;
      switch (e.key) {
        case 'ArrowLeft': newStep = Math.max(0, currentStep - 1); break;
        case 'ArrowRight': newStep = Math.min(totalSteps - 1, currentStep + 1); break;
        case 'Home': newStep = 0; break;
        case 'End': newStep = totalSteps - 1; break;
        default: return;
      }
      e.preventDefault();
      onSeek(newStep);
    },
    [currentStep, totalSteps, onSeek]
  );

  return (
    <div className="step-controller-container">
      <div className="step-controller">
        <button className="control-button reset-button" onClick={onReset} disabled={currentStep === 0 && !isPlaying} aria-label="重置" title="重置 (R)">
          <span className="icon">⏹</span>
          <span className="shortcut">R</span>
        </button>
        <button className="control-button" onClick={onPrevious} disabled={!canGoPrevious} aria-label="上一步" title="上一步 (←)">
          <span className="icon">⏮</span>
          <span className="shortcut">←</span>
        </button>
        <button className="control-button play-button" onClick={onPlayPause} aria-label={isPlaying ? '暂停' : '播放'} title={isPlaying ? '暂停 (Space)' : '播放 (Space)'}>
          <span className="icon">{isPlaying ? '⏸' : '▶'}</span>
          <span className="shortcut">Space</span>
        </button>
        <button className="control-button" onClick={onNext} disabled={!canGoNext} aria-label="下一步" title="下一步 (→)">
          <span className="icon">⏭</span>
          <span className="shortcut">→</span>
        </button>
        <span className="step-indicator">{currentStep + 1} / {totalSteps}</span>
      </div>
      <div className="progress-bar-container">
        <div ref={progressBarRef} className="progress-bar-wrapper" onClick={handleProgressBarClick} onKeyDown={handleKeyDown} role="slider" aria-label="播放进度" aria-valuemin={0} aria-valuemax={totalSteps - 1} aria-valuenow={currentStep} tabIndex={0}>
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          <div className="progress-bar-thumb" style={{ left: `${progress}%` }} onMouseDown={handleMouseDown} />
        </div>
        <div className="progress-labels">
          <span>步骤 1</span>
          <span>步骤 {totalSteps}</span>
        </div>
      </div>
    </div>
  );
}
