class EvalError extends Error {
  kind: 'Bottom' | 'NaN' | 'Infinity';

  index: number;

  constructor(kind: 'Bottom' | 'NaN' | 'Infinity', index: number) {
    super();
    this.kind = kind;
    this.index = index;
  }
}

const evaluateInner = (tokens: ReadonlyArray<string>) => {
  const stack: number[] = [];

  const push = (line: number, value: number) => {
    if (Number.isNaN(value)) {
      throw new EvalError('NaN', line);
    }

    if (!Number.isFinite(value)) {
      throw new EvalError('Infinity', line);
    }

    stack.push(value);
  };

  const pop = (line: number) => {
    const value = stack.pop();
    if (value === undefined) {
      throw new EvalError('Bottom', line);
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

        break;
      }

      case '-':
      case 'sub': {
        const y = pop(i);
        const x = pop(i);

        push(i, x - y);

        break;
      }

      case '*':
      case 'mul': {
        const y = pop(i);
        const x = pop(i);

        push(i, x * y);

        break;
      }

      case '/':
      case 'div': {
        const y = pop(i);
        const x = pop(i);

        push(i, x / y);

        break;
      }

      case '%':
      case 'divmod': {
        const y = pop(i);
        const x = pop(i);

        push(i, Math.trunc(x / y));
        push(i, x % y);

        break;
      }

      case '_':
      case 'drop': {
        pop(i);

        break;
      }

      case '=':
      case 'dup': {
        const x = pop(i);

        push(i, x);
        push(i, x);

        break;
      }

      default: {
        const n = Number(token);
        push(i, n);
      }
    }
  });

  const result = pop(tokens.length);
  return result;
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

    return [e.kind, e.index] as const;
  }
};

export default {
  evaluate,
};
