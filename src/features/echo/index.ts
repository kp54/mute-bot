import { defineFeature } from '../../core/feature.js';

export default defineFeature(() => ({
  matcher: /echo/,

  onCommand(ctx, _, args) {
    ctx.reply(args.join(' '));
  },
}));
