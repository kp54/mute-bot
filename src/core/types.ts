export type ChannelCommandContext = {
  type: 'CHANNEL';
  channelId: string;
  author: {
    id: string;
    username: string;
  };
  reply: (message: string) => Promise<void>;
  post: (message: string) => Promise<void>;
  threadify: (name: string) => Promise<ThreadCommandContext>;
};

export type ThreadCommandContext = {
  type: 'THREAD';
  threadId: string;
  author: {
    id: string;
    username: string;
  };
  post: (message: string) => Promise<void>;
};

export type CommandContext = ChannelCommandContext | ThreadCommandContext;

export type Feature = {
  matcher: RegExp;
  onCommand: (
    ctx: CommandContext,
    match: RegExpMatchArray,
    args: string[]
  ) => Promise<void>;
};

export type Memory<T> = {
  get: (key: string) => Promise<T | undefined>;
  set: (key: string, value: T) => Promise<void>;
  delete: (key: string) => Promise<void>;
  entries: () => Promise<[string, T][]>;
};

export type SetupContext = {
  config: Config;
  post: (channelId: string, message: string) => Promise<void>;
  requestMemory: <T>(id: string) => Memory<T>;
};

export type FeatureFactory = (options: SetupContext) => Feature;

export type CreateClientOptions = {
  config: Config;
  features?: FeatureFactory[];
};

export interface Config {
  discordToken: string;
  prefix: string;
}
