import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { generateAlgorithmSteps } from './algorithmSteps';
import { AlgorithmStep } from '../types';

/**
 * **Feature: random-linked-list-copy-visualizer, Property 6: Step Information Completeness**
 * 
 * *For any* algorithm step, the step should have a non-empty description, 
 * and for steps that process nodes, the correspondence between original 
 * and copied nodes should be indicated.
 * 
 * **Validates: Requirements 6.2, 6.3**
 */
describe('Property 6: Step Information Completeness', () => {
  const steps = generateAlgorithmSteps();

  it('all steps have non-empty descriptions', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: steps.length - 1 }),
        (stepIndex: number) => {
          const step = steps[stepIndex];
          return step !== undefined && 
                 step.description !== undefined && 
                 step.description.length > 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('all steps have valid code line references', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: steps.length - 1 }),
        (stepIndex: number) => {
          const step = steps[stepIndex];
          return step !== undefined &&
                 step.codeLineStart >= 1 &&
                 step.codeLineEnd >= step.codeLineStart;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('all steps have valid phase', () => {
    const validPhases = ['init', 'interleave', 'copyRandom', 'separate'];
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: steps.length - 1 }),
        (stepIndex: number) => {
          const step = steps[stepIndex];
          return step !== undefined && validPhases.includes(step.phase);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('steps with copied nodes indicate original-to-copy correspondence', () => {
    // For steps that have copied nodes, verify the correspondence is clear
    const stepsWithCopies = steps.filter(
      (step: AlgorithmStep) => step.visualState.copiedNodes.length > 0
    );
    
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: Math.max(0, stepsWithCopies.length - 1) }),
        (index: number) => {
          if (stepsWithCopies.length === 0) return true;
          const step = stepsWithCopies[index];
          if (!step) return true;
          
          // Each copied node should have a corresponding original node
          // (indicated by matching index in id)
          return step.visualState.copiedNodes.every((copyNode) => {
            const copyIndex = copyNode.id.replace('copy-', '');
            const hasCorrespondingOriginal = step.visualState.originalNodes.some(
              (origNode) => origNode.id === `orig-${copyIndex}`
            );
            return hasCorrespondingOriginal;
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('all steps have unique IDs', () => {
    const ids = steps.map((step: AlgorithmStep) => step.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('step IDs are sequential starting from 0', () => {
    steps.forEach((step: AlgorithmStep, index: number) => {
      expect(step.id).toBe(index);
    });
  });

  it('visual state always contains valid node arrays', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: steps.length - 1 }),
        (stepIndex: number) => {
          const step = steps[stepIndex];
          return step !== undefined &&
                 Array.isArray(step.visualState.originalNodes) &&
                 Array.isArray(step.visualState.copiedNodes) &&
                 Array.isArray(step.visualState.activePointers);
        }
      ),
      { numRuns: 100 }
    );
  });
});
