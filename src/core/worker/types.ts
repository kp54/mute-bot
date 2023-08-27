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

export type MessageHandler = (payload: unknown) => Promise<unknown>;

export type Pipe = {
  post: (payload: unknown) => Promise<unknown>;
};
