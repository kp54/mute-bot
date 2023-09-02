import { defineFeature } from '../../core/feature.js';

export default defineFeature({
  id: 'c341b6c7-061f-430d-92d5-58cfb4cca662',
  name: 'echo',
  create: ({ config }) => ({
    summary: null,
    usage: null,
    matcher: new RegExp(`^${config.core.prefix}echo$`),

    onCommand: async (ctx, command) => {
      if (ctx.type !== 'CHANNEL') {
        return;
      }

      await ctx.reply(command.content);
    },
  }),
});
