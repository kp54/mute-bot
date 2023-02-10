import { defineFeature } from '../../core/feature.js';

export default defineFeature(({ config: { prefix } }) => ({
  matcher: new RegExp(`^${prefix}ping$`),

  onCommand: async (ctx) => {
    if (ctx.type === 'CHANNEL') {
      await ctx.reply('pong!');
    }
  },
}));
