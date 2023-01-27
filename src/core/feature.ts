import { CommandContext } from './types.js';

type FeatureOptions = {
  prefix: string;
};

type Feature = {
  matcher: RegExp;
  onCommand: (
    ctx: CommandContext,
    match: RegExpMatchArray,
    args: string[]
  ) => void;
};

type FeatureDefinition = {
  matcher: (options: FeatureOptions) => RegExp;
  onCommand?: Feature['onCommand'];
};

// type helper
export const defineFeature =
  (definition: () => FeatureDefinition) =>
  (options: FeatureOptions): Feature => {
    const instance = definition();
    const matcher = instance.matcher(options);

    return {
      matcher,
      onCommand: instance.onCommand ?? (() => undefined),
    };
  };

export default { defineFeature };
