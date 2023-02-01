import { Feature, FeatureFactory, SetupContext } from './types.js';

type FeatureDefinition = {
  matcher: RegExp;
  onCommand?: Feature['onCommand'];
};

const noop = () => Promise.resolve();

export const defineFeature =
  (definition: (ctx: SetupContext) => FeatureDefinition): FeatureFactory =>
  (ctx: SetupContext): Feature => {
    const instance = definition(ctx);

    return {
      matcher: instance.matcher,
      onCommand: instance.onCommand ?? noop,
    };
  };

export default {
  defineFeature,
};
