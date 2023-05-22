import { defineFeature } from '../../core/feature.js';

export default defineFeature(({ config }) => ({
  matcher: new RegExp(`^${config.core.prefix}echo$`),

  onCommand: async (ctx, _, argv) => {
    const [, ...args] = argv;

    if (ctx.type === 'CHANNEL') {
      await ctx.reply(args.join(' '));
    }
  },
}));
