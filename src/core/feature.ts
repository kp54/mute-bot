export type SetupContext = {
  registerCommand: (name: string, description: string, params?: string[]) => void;
};

export type CommandContext = {
  reply: (message: string) => void;
};

export type FeatureDefinition<T> = {
  name: string;

  setup?: (ctx: SetupContext) => T;

  onCommand?: (self: T, ctx: CommandContext, command: string[]) => void;
};

// TODO
export const defineFeature: <T>(feature: FeatureDefinition<T>) => any = () => undefined;

export default { defineFeature };
