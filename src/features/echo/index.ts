import { defineFeature } from '../../core/feature.js';

export default defineFeature(() => ({
  matcher: ({ prefix }) => new RegExp(`^${prefix}echo$`),

  onCommand: async (ctx, _, args) => {
    if (ctx.type === 'CHANNEL') {
      await ctx.reply(args.join(' '));
    }
  },
}));
