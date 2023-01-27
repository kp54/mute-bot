import { defineFeature } from '../../core/feature.js';

export default defineFeature(() => ({
  matcher: ({ prefix }) => new RegExp(`^${prefix}echo$`),

  onCommand(ctx, _, args) {
    ctx.reply(args.join(' '));
  },
}));
