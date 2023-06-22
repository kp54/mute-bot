import { defineFeature } from '../../core/feature.js';

export default defineFeature(({ config }) => ({
  name: 'echo',

  matcher: new RegExp(`^${config.core.prefix}echo$`),

  onCommand: async (ctx, command) => {
    if (ctx.type !== 'CHANNEL') {
      return;
    }

    await ctx.reply(command.content);
  },
}));
