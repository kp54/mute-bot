export type CommandContext = {
  author: {
    id: string;
    username: string;
  };
  reply: (message: string) => void;
  post: (message: string) => void;
};

export type Feature = {
  matcher: RegExp;
  onCommand: (
    ctx: CommandContext,
    match: RegExpMatchArray,
    args: string[]
  ) => void;
};

export type FeatureOptions = {
  prefix: string;
};

export type FeatureFactory = (options: FeatureOptions) => Feature;
