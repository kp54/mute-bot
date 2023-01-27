import { defineFeature } from '../../core/feature.js';

export default defineFeature(() => ({
  matcher: /ping/,

  onCommand(ctx) {
    ctx.reply('pong!');
  },
}));
