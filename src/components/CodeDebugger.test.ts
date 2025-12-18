import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { generateAlgorithmSteps } from '../utils/algorithmSteps';
import { AlgorithmStep, VariableState } from '../types';

/**
 * **Feature: random-linked-list-copy-visualizer, Property 4: Variable Display Completeness**
 * 
 * *For any* step that defines variables, all variables should be displayed 
 * at their corresponding code lines, and pointer variables should include 
 * reference notation (e.g., "→ node@index").
 * 
 * **Validates: Requirements 3.3, 3.5**
 */
describe('Property 4: Variable Display Completeness', () => {
  const steps = generateAlgorithmSteps();

  it('all steps with variables have valid variable entries', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: steps.length - 1 }),
        (stepIndex: number) => {
          const step = steps[stepIndex];
          if (!step) return true;
          
          // All variables should have required fields
          return step.variables.every((v: VariableState) => 
            v.name !== undefined &&
            v.name.length > 0 &&
            v.value !== undefined &&
            v.line !== undefined &&
            v.line >= 1 &&
            v.type !== undefined
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('reference type variables include arrow notation', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: steps.length - 1 }),
        (stepIndex: number) => {
          const step = steps[stepIndex];
          if (!step) return true;
          
          // Reference type variables should include → notation
          const referenceVars = step.variables.filter(
            (v: VariableState) => v.type === 'reference'
          );
          
          return referenceVars.every((v: VariableState) => 
            v.value.includes('→') || v.value.includes('node@') || v.value.includes('copy@')
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('null type variables have null value', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: steps.length - 1 }),
        (stepIndex: number) => {
          const step = steps[stepIndex];
          if (!step) return true;
          
          const nullVars = step.variables.filter(
            (v: VariableState) => v.type === 'null'
          );
          
          return nullVars.every((v: VariableState) => 
            v.value.toLowerCase().includes('null')
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('variable line numbers are within code range', () => {
    const codeLineCount = 33; // Number of lines in JAVA_CODE
    
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: steps.length - 1 }),
        (stepIndex: number) => {
          const step = steps[stepIndex];
          if (!step) return true;
          
          return step.variables.every((v: VariableState) => 
            v.line >= 1 && v.line <= codeLineCount
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('steps processing nodes have corresponding variables', () => {
    // Steps that highlight a node should have at least one variable
    const stepsWithHighlight = steps.filter(
      (step: AlgorithmStep) => step.visualState.highlightedNodeId !== null
    );
    
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: Math.max(0, stepsWithHighlight.length - 1) }),
        (index: number) => {
          if (stepsWithHighlight.length === 0) return true;
          const step = stepsWithHighlight[index];
          if (!step) return true;
          
          // Steps with highlighted nodes should have at least one variable
          return step.variables.length > 0;
        }
      ),
      { numRuns: 100 }
    );
  });
});
