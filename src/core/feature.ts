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

type FeatureParams = Partial<Feature> & Pick<Feature, 'matcher'>;

// type helper
export const defineFeature =
  (definition: () => FeatureParams) => (): Feature => {
    const feature = definition();
    return {
      matcher: feature.matcher,
      onCommand: feature.onCommand ?? (() => undefined),
    };
  };

export default { defineFeature };
