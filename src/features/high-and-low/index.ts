import { defineFeature } from '../../core/feature.js';

const high = ['はい', 'ハイ', 'high'];

const low = ['ろー', 'ロー', 'low'];

export default defineFeature(() => ({
  matcher: /^.*$/,

  onCommand: async (ctx, command) => {
    if (ctx.type !== 'CHANNEL') {
      return;
    }

    const line = command.match[0].toLowerCase();

    if (high.includes(line)) {
      await ctx.post('はいではない');
      return;
    }

    if (low.includes(line)) {
      await ctx.post('ろーでもない');
    }
  },
}));
