import { CommandBody } from '../types.js';

export const createCommandBody = (
  matcher: RegExp,
  line: string,
  argv: readonly string[]
): CommandBody | null => {
  const [head, ...rest] = argv;

  const match = head.match(matcher);
  if (match === null) {
    return null;
  }

  const content = line.slice(match[0].length).trim();

  return {
    match,
    args: rest,
    content,
    line,
  };
};

export default {
  createCommandBody,
};
