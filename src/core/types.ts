export type CommandContext = {
  channelId: string;
  author: {
    id: string;
    username: string;
  };
  reply: (message: string) => Promise<void>;
  post: (message: string) => Promise<void>;
  threadify: (name: string) => Promise<CommandContext>;
};

export type Feature = {
  matcher: RegExp;
  onCommand: (
    ctx: CommandContext,
    match: RegExpMatchArray,
    args: string[]
  ) => Promise<void>;
};

export type FeatureOptions = {
  prefix: string;
};

export type FeatureFactory = (options: FeatureOptions) => Feature;
