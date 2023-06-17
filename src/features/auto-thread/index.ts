import { defineFeature } from '../../core/feature.js';

export default defineFeature((setupCtx) => {
  const { prefix } = setupCtx.config.core;
  const memory = setupCtx.requestMemory<true>(
    '52c75dc6-480d-4ca0-a3ed-c126912fb056'
  );

  return {
    matcher: /^./,
    onCommand: async (ctx, _match, argv) => {
      if (ctx.type !== 'CHANNEL') {
        return;
      }

      if (argv.length === 0) {
        return;
      }

      const isEnabled = (await memory.get(ctx.channelId)) ?? false;

      const [head, ..._tail] = argv;
      if (head === `${prefix}auto-thread`) {
        if (isEnabled) {
          await memory.delete(ctx.channelId);
          await ctx.post('自動スレッドを無効にしました');
        } else {
          await memory.set(ctx.channelId, true);
          await ctx.post('自動スレッドを有効にしました');
        }
        return;
      }

      if (isEnabled) {
        await ctx.threadify(argv.join(' '));
      }
    },
  };
});
