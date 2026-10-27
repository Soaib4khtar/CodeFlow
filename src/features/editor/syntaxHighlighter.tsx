import React from 'react';

const KEYWORDS = new Set([
  'function',
  'let',
  'const',
  'var',
  'while',
  'for',
  'if',
  'else',
  'return',
  'async',
  'await',
  'def',
  'class',
  'new',
  'of',
  'in',
  'switch',
  'case',
  'break',
  'continue',
  'try',
  'catch',
  'throw',
  'typeof',
  'int',
  'bool',
  'void',
  'auto'
]);

const BUILTINS = new Set([
  'Math',
  'floor',
  'ceil',
  'round',
  'max',
  'min',
  'abs',
  'console',
  'log',
  'Map',
  'Set',
  'Array',
  'Object',
  'push',
  'pop',
  'shift',
  'unshift',
  'length',
  'size',
  'slice',
  'splice',
  'reduce',
  'fill',
  'binarySearch'
]);

const LITERALS = new Set([
  'true',
  'false',
  'null',
  'undefined',
  'NaN',
  'Infinity',
  'None',
  'True',
  'False'
]);

/**
 * Tokenizes a single line of source code and returns colored JSX spans
 * so syntax highlighting stays active while the user types in the editor.
 */
export function highlightSyntax(line: string): React.ReactNode {
  if (!line || line.length === 0) {
    return <span className="invisible select-none">_</span>;
  }

  // Full-line comments
  const trimmed = line.trimStart();
  if (trimmed.startsWith('//') || trimmed.startsWith('#')) {
    const indentCount = line.length - trimmed.length;
    return (
      <>
        <span>{line.slice(0, indentCount)}</span>
        <span className="text-slate-500 italic">{trimmed}</span>
      </>
    );
  }

  // Tokenize line by keywords, builtins, literals, strings, numbers, and inline comments
  const tokens = line.split(
    /(\b(?:function|let|const|var|while|for|if|else|return|async|await|def|class|new|of|in|switch|case|break|continue|try|catch|throw|typeof|true|false|null|undefined|None|True|False|Math|floor|ceil|round|max|min|abs|console|log|Map|Set|Array|Object|push|pop|shift|unshift|length|size|slice|splice|reduce|fill|binarySearch)\b|\b\d+(?:\.\d+)?\b|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\/\/.*$|#.*$)/g
  );

  return tokens.map((tok, i) => {
    if (!tok) return null;

    if (tok.startsWith('//') || tok.startsWith('#')) {
      return (
        <span key={i} className="text-slate-500 italic">
          {tok}
        </span>
      );
    }
    if (KEYWORDS.has(tok)) {
      return (
        <span key={i} className="text-[#C084FC] font-medium">
          {tok}
        </span>
      );
    }
    if (BUILTINS.has(tok)) {
      return (
        <span key={i} className="text-[#60A5FA]">
          {tok}
        </span>
      );
    }
    if (LITERALS.has(tok) || /^\d+(\.\d+)?$/.test(tok)) {
      return (
        <span key={i} className="text-[#FBBF24]">
          {tok}
        </span>
      );
    }
    if (
      (tok.startsWith('"') && tok.endsWith('"')) ||
      (tok.startsWith("'") && tok.endsWith("'")) ||
      (tok.startsWith('`') && tok.endsWith('`'))
    ) {
      return (
        <span key={i} className="text-[#34D399]">
          {tok}
        </span>
      );
    }
    return (
      <span key={i} className="text-slate-200">
        {tok}
      </span>
    );
  });
}
