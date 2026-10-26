import { PracticeProblem } from '../types/codeflow';

/**
 * Builds an empty starter template (function signature only, no solution)
 * from the problem's reference code.
 */
export function getBlankStarterCode(problem: PracticeProblem): string {
  const source = problem.starterCode || problem.solutionCode || '';
  const fn = source.match(/function\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)/);
  if (fn) {
    return `function ${fn[1]}(${fn[2]}) {\n  // Write your solution here\n  \n}`;
  }
  const arrow = source.match(/(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*\(([^)]*)\)\s*=>/);
  if (arrow) {
    return `const ${arrow[1]} = (${arrow[2]}) => {\n  // Write your solution here\n  \n};`;
  }
  return '// Write your solution here\n';
}

/**
 * Converts the reference solution into readable, language-neutral pseudocode.
 */
export function generatePseudocode(problem: PracticeProblem): string {
  const code = problem.solutionCode || '';
  const out: string[] = [];
  let depth = 0;
  const pad = () => '  '.repeat(depth);

  const convert = (s: string): string =>
    s
      .replace(/^(const|let|var)\s+/, '')
      .replace(/Math\.floor\(([^;]*)\)/g, 'floor($1)')
      .replace(/\.length\b/g, '.size')
      .replace(/===/g, '==')
      .replace(/!==/g, '!=')
      .replace(/&&/g, ' AND ')
      .replace(/\|\|/g, ' OR ')
      .replace(/\s{2,}/g, ' ')
      .replace(/;$/, '')
      .trim();

  const emit = (line: string) => out.push(pad() + line);

  // Split into logical statements so one-liners with braces become several lines
  const normalized = code
    .replace(/\{/g, '{\n')
    .replace(/\}/g, '\n}\n')
    .replace(/;(?![^(]*\))\s*(?=\S)/g, ';\n');

  for (const raw of normalized.split('\n')) {
    const line = raw.trim();
    if (!line) continue;

    if (line === '}' || line === '};') {
      depth = Math.max(0, depth - 1);
      continue;
    }

    let m: RegExpMatchArray | null;
    if ((m = line.match(/^function\s+(\w+)\s*\(([^)]*)\)\s*\{?$/))) {
      emit(`FUNCTION ${m[1]}(${m[2]})`);
      depth++;
    } else if ((m = line.match(/^(?:const|let|var)\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>\s*\{?$/))) {
      emit(`DEFINE helper ${m[1]}(${m[2]})`);
      depth++;
    } else if ((m = line.match(/^for\s*\(\s*(?:const|let)\s+(\w+)\s+of\s+(.+)\)\s*\{?$/))) {
      emit(`FOR EACH ${m[1]} IN ${convert(m[2])}`);
      depth++;
    } else if ((m = line.match(/^for\s*\((.*?);(.*?);(.*?)\)\s*\{?$/))) {
      emit(`FOR ${convert(m[1])} WHILE ${convert(m[2])} STEP ${convert(m[3])}`);
      depth++;
    } else if ((m = line.match(/^while\s*\((.*)\)\s*\{?$/))) {
      emit(`WHILE ${convert(m[1])}`);
      depth++;
    } else if ((m = line.match(/^(?:\}\s*)?else\s+if\s*\((.*)\)\s*\{?$/))) {
      emit(`ELSE IF ${convert(m[1])}`);
      depth++;
    } else if ((m = line.match(/^else\s*\{?$/))) {
      emit('ELSE');
      depth++;
    } else if ((m = line.match(/^if\s*\((.*)\)\s*\{?$/))) {
      emit(`IF ${convert(m[1])} THEN`);
      depth++;
    } else if ((m = line.match(/^if\s*\((.*?)\)\s*(return\b.*|.+)$/))) {
      const body = m[2].startsWith('return')
        ? `RETURN ${convert(m[2].replace(/^return\s*/, ''))}`
        : convert(m[2]);
      emit(`IF ${convert(m[1])} THEN ${body}`);
    } else if ((m = line.match(/^else\s+(.+)$/))) {
      emit(`ELSE ${convert(m[1])}`);
    } else if ((m = line.match(/^return\b\s*(.*)$/))) {
      emit(`RETURN ${convert(m[1])}`.trim());
    } else if (line.endsWith('{')) {
      emit(convert(line.slice(0, -1)));
      depth++;
    } else {
      emit(convert(line));
    }
  }

  const body = out.filter((l) => l.trim()).join('\n');
  return `// ${problem.title}\n${body}\nEND`.replace(/\nEND$/, '\nEND FUNCTION');
}
