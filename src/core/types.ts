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

export type SetupContext = {
  prefix: string;
};

export type FeatureFactory = (options: SetupContext) => Feature;
