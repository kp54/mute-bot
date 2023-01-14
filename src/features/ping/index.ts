import { defineFeature } from '../../core/feature';

export default defineFeature({
  matcher: /ping/,

  onCommand(ctx) {
    ctx.reply('pong!');
  },
});
