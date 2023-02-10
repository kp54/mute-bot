import { defineFeature } from '../../core/feature.js';

export default defineFeature(({ config }) => ({
  matcher: new RegExp(`^${config.core.prefix}echo$`),

  onCommand: async (ctx, _, args) => {
    if (ctx.type === 'CHANNEL') {
      await ctx.reply(args.join(' '));
    }
  },
}));
