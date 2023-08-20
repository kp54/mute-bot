import { Logger } from './types.js';

export const createConsoleLogger = (): Logger => ({
  // eslint-disable-next-line no-console
  log: (...values) => console.log(values.join('\n')),
  // eslint-disable-next-line no-console
  error: (...values) => console.error(values.join('\n')),
});
