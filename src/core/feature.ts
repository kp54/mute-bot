export type CommandContext = {
  reply: (message: string) => void;
  post: (message: string) => void;
};

export type Feature = {
  name: string;

  onCommand?: (ctx: CommandContext, command: string[]) => void;
};

// type helper
export const defineFeature = (feature: Feature): Required<Feature> => ({
  name: feature.name,
  onCommand: feature.onCommand ?? (() => undefined),
});

export default { defineFeature };
