const enumerate = <T>(arr: ReadonlyArray<T>) =>
  arr.map((x, i) => [i, x] as const);

const bottom = (i: number) => ['Bottom', i] as const;

export const evaluate = (tokens: ReadonlyArray<string>) => {
  if (tokens.length === 0) {
    return ['Empty'] as const;
  }

  const stack: number[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const [i, token] of enumerate(tokens)) {
    switch (token) {
      case '+':
      case 'add': {
        const y = stack.pop();
        const x = stack.pop();

        if (x === undefined || y === undefined) {
          return bottom(i);
        }

        stack.push(x + y);

        break;
      }

      case '-':
      case 'sub': {
        const y = stack.pop();
        const x = stack.pop();

        if (x === undefined || y === undefined) {
          return bottom(i);
        }

        stack.push(x - y);

        break;
      }

      case '*':
      case 'mul': {
        const y = stack.pop();
        const x = stack.pop();

        if (x === undefined || y === undefined) {
          return bottom(i);
        }

        stack.push(x * y);

        break;
      }

      case '/':
      case 'div': {
        const y = stack.pop();
        const x = stack.pop();

        if (x === undefined || y === undefined) {
          return bottom(i);
        }

        stack.push(x / y);

        break;
      }

      case '%':
      case 'divmod': {
        const y = stack.pop();
        const x = stack.pop();

        if (x === undefined || y === undefined) {
          return bottom(i);
        }

        stack.push(Math.trunc(x / y));
        stack.push(x % y);

        break;
      }

      case '_':
      case 'drop': {
        const x = stack.pop();

        if (x === undefined) {
          return bottom(i);
        }

        break;
      }

      case '=':
      case 'dup': {
        const x = stack.pop();

        if (x === undefined) {
          return bottom(i);
        }

        stack.push(x);
        stack.push(x);

        break;
      }

      default: {
        const n = Number(token);
        if (Number.isNaN(n)) {
          return ['NaN', i] as const;
        }
        stack.push(n);
      }
    }
  }

  const result = stack.pop();
  if (result === undefined) {
    return bottom(tokens.length);
  }

  return ['Ok', result] as const;
};

export default {
  evaluate,
};
