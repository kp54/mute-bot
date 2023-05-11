import { defineFeature } from '../../core/feature.js';

const high = ['はい', 'ハイ', 'high'];

const low = ['ろー', 'ロー', 'low'];

export default defineFeature(() => ({
  matcher: /^.*$/,

  onCommand: async (ctx, match) => {
    if (ctx.type !== 'CHANNEL') {
      return;
    }

    const line = match[0].toLowerCase();

    if (high.includes(line)) {
      await ctx.post('はいではない');
      return;
    }

    if (low.includes(line)) {
      await ctx.post('ろーでもない');
    }
  },
}));
