import { defineFeature } from '../../core/feature.js';

export default defineFeature(() => ({
  matcher: ({ prefix }) => new RegExp(`^${prefix}ping$`),

  onCommand: async (ctx) => {
    await ctx.reply('pong!');
  },
}));
