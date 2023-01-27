import { Feature, FeatureFactory, FeatureOptions } from './types.js';

type FeatureDefinition = {
  matcher: (options: FeatureOptions) => RegExp;
  onCommand?: Feature['onCommand'];
};

export const defineFeature =
  (definition: () => FeatureDefinition): FeatureFactory =>
  (options: FeatureOptions): Feature => {
    const instance = definition();
    const matcher = instance.matcher(options);

    return {
      matcher,
      onCommand: instance.onCommand ?? (() => undefined),
    };
  };

export default {
  defineFeature,
};
