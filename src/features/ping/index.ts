import { defineFeature } from '../../core/feature.js';

export default defineFeature(() => ({
  matcher: ({ prefix }) => new RegExp(`^${prefix}ping$`),

  onCommand(ctx) {
    ctx.reply('pong!');
  },
}));
