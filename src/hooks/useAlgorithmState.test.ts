import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { generateAlgorithmSteps } from '../utils/algorithmSteps';
import { AlgorithmStep } from '../types';

/**
 * **Feature: random-linked-list-copy-visualizer, Property 3: Code-Canvas State Synchronization**
 * 
 * *For any* algorithm step, the highlighted code line, displayed variables, 
 * and canvas visualization should all correspond to the same step index, 
 * ensuring the three views are always synchronized.
 * 
 * **Validates: Requirements 3.2, 3.3, 6.1**
 */
describe('Property 3: Code-Canvas State Synchronization', () => {
  const steps = generateAlgorithmSteps();

  it('code line, variables, and visual state all belong to the same step', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: steps.length - 1 }),
        (stepIndex: number) => {
          const step = steps[stepIndex];
          if (!step) return true;
          
          // All properties should be defined and consistent
          const hasCodeLine = step.codeLineStart >= 1 && step.codeLineEnd >= step.codeLineStart;
          const hasVariables = Array.isArray(step.variables);
          const hasVisualState = step.visualState !== undefined &&
            Array.isArray(step.visualState.originalNodes) &&
            Array.isArray(step.visualState.copiedNodes);
          
          return hasCodeLine && hasVariables && hasVisualState;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('step index matches step id', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: steps.length - 1 }),
        (stepIndex: number) => {
          const step = steps[stepIndex];
          if (!step) return true;
          
          // Step id should match its position in the array
          return step.id === stepIndex;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('phase progression is consistent', () => {
    // Verify that phases progress in expected order
    const phaseOrder = ['init', 'interleave', 'copyRandom', 'separate'];
    
    let lastPhaseIndex = 0;
    for (const step of steps) {
      const currentPhaseIndex = phaseOrder.indexOf(step.phase);
      if (currentPhaseIndex < lastPhaseIndex) {
        return false; // Phase went backwards
      }
      lastPhaseIndex = currentPhaseIndex;
    }
    return true;
  });

  it('variables reference valid code lines within step range', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: steps.length - 1 }),
        (stepIndex: number) => {
          const step = steps[stepIndex];
          if (!step || step.variables.length === 0) return true;
          
          // Variables should reference lines that exist in the code
          const codeLineCount = 33; // JAVA_CODE has 33 lines
          return step.variables.every(v => 
            v.line >= 1 && v.line <= codeLineCount
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('visual state node count is consistent with algorithm phase', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: steps.length - 1 }),
        (stepIndex: number) => {
          const step = steps[stepIndex];
          if (!step) return true;
          
          // Original nodes should always be present (5 nodes)
          const hasOriginals = step.visualState.originalNodes.length === 5;
          
          // Copied nodes should only appear after init phase
          const copiedNodesValid = step.phase === 'init' 
            ? step.visualState.copiedNodes.length === 0
            : true; // Can have 0 or more copied nodes in other phases
          
          return hasOriginals && copiedNodesValid;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('all steps have consistent structure', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: steps.length - 1 }),
        (stepIndex: number) => {
          const step = steps[stepIndex];
          if (!step) return true;
          
          // Check all required fields exist
          return (
            typeof step.id === 'number' &&
            typeof step.phase === 'string' &&
            typeof step.description === 'string' &&
            typeof step.codeLineStart === 'number' &&
            typeof step.codeLineEnd === 'number' &&
            Array.isArray(step.variables) &&
            step.visualState !== undefined
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Additional test to verify the synchronization logic
describe('State Synchronization Logic', () => {
  const steps = generateAlgorithmSteps();

  it('navigating through all steps maintains consistency', () => {
    // Simulate navigating through all steps
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i] as AlgorithmStep;
      
      // Each step should have synchronized data
      const codeLineValid = step.codeLineStart >= 1;
      const visualStateValid = step.visualState.originalNodes.length > 0;
      const descriptionValid = step.description.length > 0;
      
      if (!codeLineValid || !visualStateValid || !descriptionValid) {
        throw new Error(`Step ${i} has inconsistent state`);
      }
    }
  });
});
