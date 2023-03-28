class EvalError extends Error {
  kind: 'Bottom' | 'NaN' | 'Infinity';

  index: number;

  lines: string;

  constructor(
    kind: 'Bottom' | 'NaN' | 'Infinity',
    index: number,
    buffer: string[]
  ) {
    super();
    this.kind = kind;
    this.index = index;
    this.lines = buffer.join('\n');
  }
}

const evaluateInner = (tokens: ReadonlyArray<string>) => {
  const buffer: string[] = [];
  const stack: number[] = [];

  const push = (line: number, value: number) => {
    if (Number.isNaN(value)) {
      throw new EvalError('NaN', line, buffer);
    }

    if (!Number.isFinite(value)) {
      throw new EvalError('Infinity', line, buffer);
    }

    stack.push(value);
  };

  const pop = (line: number) => {
    const value = stack.pop();
    if (value === undefined) {
      throw new EvalError('Bottom', line, buffer);
    }
    return value;
  };

  tokens.forEach((token, i) => {
    switch (token) {
      case '+':
      case 'add': {
        const y = pop(i);
        const x = pop(i);

        push(i, x + y);

        return;
      }

      case '-':
      case 'sub': {
        const y = pop(i);
        const x = pop(i);

        push(i, x - y);

        return;
      }

      case '*':
      case 'mul': {
        const y = pop(i);
        const x = pop(i);

        push(i, x * y);

        return;
      }

      case '/':
      case 'div': {
        const y = pop(i);
        const x = pop(i);

        push(i, x / y);

        return;
      }

      case '%':
      case 'divmod': {
        const y = pop(i);
        const x = pop(i);

        push(i, Math.trunc(x / y));
        push(i, x % y);

        return;
      }

      case '_':
      case 'drop': {
        pop(i);

        return;
      }

      case '.':
      case 'dup': {
        const x = pop(i);

        push(i, x);
        push(i, x);

        return;
      }

      case '<':
      case 'rol': {
        const x = stack.shift();
        if (x !== undefined) {
          stack.push(x);
        }
        return;
      }

      case '>':
      case 'ror': {
        const x = stack.pop();
        if (x !== undefined) {
          stack.unshift(x);
        }
        return;
      }

      case '=':
      case 'print': {
        const x = pop(i);

        buffer.push(x.toString());
        push(i, x);

        return;
      }

      case '$':
      case 'stack': {
        buffer.push(stack.join(', '));

        return;
      }

      default: {
        const n = Number(token);
        push(i, n);
      }
    }
  });

  return buffer.join('\n');
};

export const evaluate = (tokens: ReadonlyArray<string>) => {
  if (tokens.length === 0) {
    return ['Empty'] as const;
  }

  try {
    const result = evaluateInner(tokens);
    return ['Ok', result] as const;
  } catch (e) {
    if (!(e instanceof EvalError)) {
      throw e;
    }

    return [e.kind, e.index, e.lines] as const;
  }
};

export default {
  evaluate,
};
