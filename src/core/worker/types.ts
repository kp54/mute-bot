import { Config, FeatureFactory } from '../types.js';

export type WorkerData = {
  path: string;
  config: Config;
};

export type FeatureModule = {
  default: FeatureFactory;
};

export type Message = {
  kind: 'request' | 'response';
  requestId: string;
  payload: unknown;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MessageHandler = (payload: any) => Promise<any>;

export type Pipe = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post: (payload: any) => Promise<any>;
};
