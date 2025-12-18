import { useState } from 'react';
import { Header } from './components/Header';
import { FloatingBall } from './components/FloatingBall';
import { CodeDebugger } from './components/CodeDebugger';
import { LinkedListCanvas } from './components/LinkedListCanvas';
import { StepController } from './components/StepController';
import { useAlgorithmState } from './hooks/useAlgorithmState';
import { generateAlgorithmSteps, JAVA_CODE } from './utils/algorithmSteps';

const LEETCODE_URL = 'https://leetcode.cn/problems/copy-list-with-random-pointer/';
const GITHUB_URL = 'https://github.com/fuck-algorithm/leetcode-138-copy-list-with-random-pointer';
const QR_CODE_IMAGE = './qrcode-placeholder.svg';
const QR_TOOLTIP = '扫码发送 "leetcode" 加入算法交流群';

function App() {
  const [steps] = useState(() => generateAlgorithmSteps());
  
  const {
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
  } = useAlgorithmState({ steps, playbackSpeed: 1500 });

  return (
    <div className="app">
      <Header
        title="138. 随机链表的复制"
        leetcodeUrl={LEETCODE_URL}
        githubUrl={GITHUB_URL}
      />

      <div className="main-content">
        <div className="left-panel">
          <CodeDebugger
            code={JAVA_CODE}
            currentLineStart={currentStep?.codeLineStart ?? 1}
            currentLineEnd={currentStep?.codeLineEnd ?? 1}
            variables={currentStep?.variables ?? []}
          />
        </div>

        <div className="right-panel">
          <div className="canvas-container">
            {currentStep && (
              <div className="step-description">
                <strong>步骤 {currentStep.id + 1}/{totalSteps}:</strong>{' '}
                {currentStep.description}
              </div>
            )}
            {currentStep && (
              <LinkedListCanvas
                originalNodes={currentStep.visualState.originalNodes}
                copiedNodes={currentStep.visualState.copiedNodes}
                activePointers={currentStep.visualState.activePointers}
                highlightedNodeId={currentStep.visualState.highlightedNodeId}
                stepDescription={currentStep.description}
                phase={currentStep.phase}
              />
            )}
          </div>
        </div>
      </div>

      <StepController
        currentStep={currentStepIndex}
        totalSteps={totalSteps}
        isPlaying={isPlaying}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onPlayPause={handlePlayPause}
        onSeek={handleSeek}
        onReset={handleReset}
      />

      <FloatingBall qrCodeImage={QR_CODE_IMAGE} tooltipText={QR_TOOLTIP} />
    </div>
  );
}

export default App;
