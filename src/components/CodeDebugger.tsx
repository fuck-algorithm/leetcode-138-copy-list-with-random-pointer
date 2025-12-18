import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-java';
import { VariableState } from '../types';
import './CodeDebugger.css';

interface CodeDebuggerProps {
  code: string;
  currentLineStart: number;
  currentLineEnd: number;
  variables: VariableState[];
}

export function CodeDebugger({
  code,
  currentLineStart,
  currentLineEnd,
  variables,
}: CodeDebuggerProps) {
  const codeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightAllUnder(codeRef.current);
    }
  }, [code]);

  const lines = code.split('\n');

  return (
    <div className="code-debugger" ref={codeRef}>
      <div className="code-debugger-header">
        <span className="file-icon">☕</span>
        <span className="file-name">Solution.java</span>
      </div>
      <div className="code-lines-container">
        {lines.map((line, index) => {
          const lineNumber = index + 1;
          const isHighlighted =
            lineNumber >= currentLineStart && lineNumber <= currentLineEnd;
          const lineVariables = variables.filter((v) => v.line === lineNumber);

          return (
            <div
              key={index}
              className={`code-line ${isHighlighted ? 'highlighted' : ''}`}
            >
              <span className="debug-arrow">{isHighlighted ? '▶' : ''}</span>
              <span className="breakpoint-gutter" />
              <span className="line-number">{lineNumber}</span>
              <code className="code-content language-java">{line || ' '}</code>
              {lineVariables.length > 0 && (
                <VariableInspector variables={lineVariables} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface VariableInspectorProps {
  variables: VariableState[];
}

function VariableInspector({ variables }: VariableInspectorProps) {
  return (
    <span className="variable-display">
      {variables.map((v, i) => (
        <span key={i} className={`variable-item variable-${v.type}`}>
          <span className="var-name">{v.name}</span>
          <span className="var-equals">=</span>
          <span className="var-value">{v.value}</span>
          {i < variables.length - 1 && <span style={{ color: '#666' }}>,</span>}
        </span>
      ))}
    </span>
  );
}
