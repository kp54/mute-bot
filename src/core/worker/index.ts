import { isMainThread, Worker } from 'worker_threads';
import { formatError } from '../client/format-error.js';
import { Config, Logger } from '../types.js';
import { WorkerData } from './types.js';

const noNullish = <T>(value: T | null | undefined, message?: string): T => {
  if (value === null || value === undefined) {
    throw new Error(message);
  }

  return value;
};

export const init = async (logger: Logger, config: Config, path: string) => {
  if (!isMainThread) {
    throw new Error();
  }

  const workerData: WorkerData = {
    config,
    path: noNullish(await import.meta.resolve?.(path)),
  };

  const worker = new Worker('./shim.js', { workerData });
  worker.on('error', (e) => {
    logger.error(`feature {foobar} has crashed: ${formatError(e)}`);
  });
};
