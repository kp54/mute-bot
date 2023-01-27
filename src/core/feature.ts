import { Feature, FeatureFactory, FeatureOptions } from './types.js';

type FeatureDefinition = {
  matcher: (options: FeatureOptions) => RegExp;
  onCommand?: Feature['onCommand'];
};

const noop = () => Promise.resolve();

export const defineFeature =
  (definition: () => FeatureDefinition): FeatureFactory =>
  (options: FeatureOptions): Feature => {
    const instance = definition();
    const matcher = instance.matcher(options);

    return {
      matcher,
      onCommand: instance.onCommand ?? noop,
    };
  };

export default {
  defineFeature,
};
