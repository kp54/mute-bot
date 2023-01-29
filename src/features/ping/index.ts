import { defineFeature } from '../../core/feature.js';

export default defineFeature(() => ({
  matcher: ({ prefix }) => new RegExp(`^${prefix}ping$`),

  onCommand: async (ctx) => {
    if (ctx.type === 'CHANNEL') {
      await ctx.reply('pong!');
    }
  },
}));
