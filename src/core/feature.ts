import { FeatureFactory, FeatureInstance, SetupContext } from './types.js';

type StrictOmit<T, U extends keyof T> = Omit<T, U>;

type FeatureDefinition = StrictOmit<FeatureFactory, 'create'> & {
  create: (ctx: SetupContext) => FeatureInstance;
};

export const defineFeature = (
  definition: FeatureDefinition,
): FeatureFactory => ({
  id: definition.id,
  name: definition.name,
  create: (ctx) => {
    const instance = definition.create(ctx);
    return {
      ...definition,
      ...instance,
    };
  },
});
