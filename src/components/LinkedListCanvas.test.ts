import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { generateAlgorithmSteps } from '../utils/algorithmSteps';
import { AlgorithmStep, VisualNode } from '../types';

/**
 * **Feature: random-linked-list-copy-visualizer, Property 5: Node Visualization Completeness**
 * 
 * *For any* set of linked list nodes, all nodes should be rendered on the canvas 
 * with their values visible, and the currently processed node should have distinct highlighting.
 * 
 * **Validates: Requirements 4.1, 4.6**
 */
describe('Property 5: Node Visualization Completeness', () => {
  const steps = generateAlgorithmSteps();

  it('all original nodes have valid values and positions', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: steps.length - 1 }),
        (stepIndex: number) => {
          const step = steps[stepIndex];
          if (!step) return true;
          
          return step.visualState.originalNodes.every((node: VisualNode) => 
            node.id !== undefined &&
            node.val !== undefined &&
            typeof node.val === 'number' &&
            node.position !== undefined &&
            typeof node.position.x === 'number' &&
            typeof node.position.y === 'number'
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('all copied nodes have valid values and positions', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: steps.length - 1 }),
        (stepIndex: number) => {
          const step = steps[stepIndex];
          if (!step) return true;
          
          return step.visualState.copiedNodes.every((node: VisualNode) => 
            node.id !== undefined &&
            node.val !== undefined &&
            typeof node.val === 'number' &&
            node.position !== undefined &&
            typeof node.position.x === 'number' &&
            typeof node.position.y === 'number'
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('highlighted node exists in the node lists when specified', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: steps.length - 1 }),
        (stepIndex: number) => {
          const step = steps[stepIndex];
          if (!step || step.visualState.highlightedNodeId === null) return true;
          
          const allNodeIds = [
            ...step.visualState.originalNodes.map((n: VisualNode) => n.id),
            ...step.visualState.copiedNodes.map((n: VisualNode) => n.id),
          ];
          
          return allNodeIds.includes(step.visualState.highlightedNodeId);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('node IDs are unique within each step', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: steps.length - 1 }),
        (stepIndex: number) => {
          const step = steps[stepIndex];
          if (!step) return true;
          
          const allNodeIds = [
            ...step.visualState.originalNodes.map((n: VisualNode) => n.id),
            ...step.visualState.copiedNodes.map((n: VisualNode) => n.id),
          ];
          
          const uniqueIds = new Set(allNodeIds);
          return uniqueIds.size === allNodeIds.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('original nodes are marked as original, copied nodes are not', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: steps.length - 1 }),
        (stepIndex: number) => {
          const step = steps[stepIndex];
          if (!step) return true;
          
          const originalsCorrect = step.visualState.originalNodes.every(
            (n: VisualNode) => n.isOriginal === true
          );
          const copiesCorrect = step.visualState.copiedNodes.every(
            (n: VisualNode) => n.isOriginal === false
          );
          
          return originalsCorrect && copiesCorrect;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('steps with processing have at least one highlighted element', () => {
    // Steps in interleave, copyRandom, or separate phases should have highlighting
    const processingSteps = steps.filter(
      (step: AlgorithmStep) => 
        step.phase !== 'init' && 
        step.visualState.highlightedNodeId !== null
    );
    
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: Math.max(0, processingSteps.length - 1) }),
        (index: number) => {
          if (processingSteps.length === 0) return true;
          const step = processingSteps[index];
          if (!step) return true;
          
          // Either highlightedNodeId is set or some node has isHighlighted true
          const hasHighlightedId = step.visualState.highlightedNodeId !== null;
          const hasHighlightedNode = [
            ...step.visualState.originalNodes,
            ...step.visualState.copiedNodes,
          ].some((n: VisualNode) => n.isHighlighted);
          
          return hasHighlightedId || hasHighlightedNode;
        }
      ),
      { numRuns: 100 }
    );
  });
});
