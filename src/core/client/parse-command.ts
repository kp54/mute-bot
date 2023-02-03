export const parseCommand = (line: string): ReadonlyArray<string> | null => {
  let quoting: 'SINGLE' | 'DOUBLE' | null = null;
  let escaping = false;
  let seeking = true;

  const result: string[] = [];
  const buffer: string[] = [];

  [...line, '\n'].forEach((char) => {
    if (/\s/.test(char)) {
      if (seeking) {
        return;
      }

      if (quoting === null) {
        const part = buffer.join('');
        buffer.splice(0);
        seeking = true;
        result.push(part);
        return;
      }
    }

    seeking = false;

    if (escaping) {
      buffer.push(char);
      escaping = false;
      return;
    }

    if (char === `'`) {
      switch (quoting) {
        case null:
          quoting = 'SINGLE';
          return;
        case 'SINGLE':
          quoting = null;
          return;
        case 'DOUBLE':
          buffer.push(`'`);
          return;
        default:
          throw new Error();
      }
    }

    if (char === `"`) {
      switch (quoting) {
        case null:
          quoting = 'DOUBLE';
          return;
        case 'SINGLE':
          buffer.push(`"`);
          return;
        case 'DOUBLE':
          quoting = null;
          return;
        default:
          throw new Error();
      }
    }

    if (char === `\\`) {
      escaping = true;
      return;
    }

    buffer.push(char);
  });

  if (quoting !== null || escaping) {
    return null;
  }

  return result;
};

export default { parseCommand };
