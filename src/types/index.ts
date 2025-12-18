// Linked List Node Model
export interface ListNode {
  val: number;
  next: ListNode | null;
  random: ListNode | null;
}

// Visualization Node Model
export interface VisualNode {
  id: string;
  val: number;
  index: number;
  nextIndex: number | null;
  randomIndex: number | null;
  position: { x: number; y: number };
  isOriginal: boolean;
  isHighlighted: boolean;
  isProcessed: boolean;
}

// Variable State for Code Debugger
export interface VariableState {
  name: string;
  value: string;
  line: number;
  type: 'primitive' | 'reference' | 'null';
}

// Pointer Highlight for Canvas
export interface PointerHighlight {
  from: string;
  to: string;
  type: 'next' | 'random';
  isAnimating: boolean;
}

// Algorithm Step
export interface AlgorithmStep {
  id: number;
  phase: 'init' | 'interleave' | 'copyRandom' | 'separate';
  description: string;
  codeLineStart: number;
  codeLineEnd: number;
  variables: VariableState[];
  visualState: {
    originalNodes: VisualNode[];
    copiedNodes: VisualNode[];
    activePointers: PointerHighlight[];
    highlightedNodeId: string | null;
  };
}

// Algorithm State
export interface AlgorithmState {
  steps: AlgorithmStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  playbackSpeed: number;
}

// Keyboard Shortcut
export interface KeyboardShortcut {
  key: string;
  action: 'previous' | 'next' | 'playPause' | 'reset';
  description: string;
}

export const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  { key: 'ArrowLeft', action: 'previous', description: '←' },
  { key: 'ArrowRight', action: 'next', description: '→' },
  { key: ' ', action: 'playPause', description: 'Space' },
  { key: 'r', action: 'reset', description: 'R' },
];
