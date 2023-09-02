import { defineFeature } from '../../core/feature.js';

export default defineFeature({
  id: '52c75dc6-480d-4ca0-a3ed-c126912fb056',
  name: 'auto-thread',
  create: (setupCtx) => {
    const { prefix } = setupCtx.config.core;
    const memory = setupCtx.requestMemory<true>();

    return {
      summary: '自動スレッド化',
      usage: null,
      matcher: new RegExp(`(?<toggle>^${prefix}auto-thread$)|(^.)`),

      onCommand: async (ctx, command) => {
        if (ctx.type !== 'CHANNEL') {
          return;
        }

        const isToggle = command.match.groups?.toggle !== undefined;
        const isEnabled = (await memory.get(ctx.channelId)) ?? false;

        if (isToggle) {
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
          await ctx.threadify(command.line);
        }
      },
    };
  },
});
