import { defineFeature } from '../../core/feature';

export default defineFeature({
  matcher: /echo/,

  onCommand(ctx, _, args) {
    ctx.reply(args.join(' '));
  },
});
