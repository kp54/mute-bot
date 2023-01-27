import { defineFeature } from '../../core/feature.js';

export default defineFeature(() => ({
  matcher: ({ prefix }) => new RegExp(`^${prefix}echo$`),

  onCommand: async (ctx, _, args) => {
    await ctx.reply(args.join(' '));
  },
}));
