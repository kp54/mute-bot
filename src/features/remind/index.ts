import { defineFeature } from '../../core/feature.js';
import { ChannelCommandContext } from '../../core/types.js';

type Reminder = {
  dueAt: number;
  handler: () => void;
};

const useage = async (ctx: ChannelCommandContext) => {
  await ctx.reply('構文: remind <minute> <message>');
};

export default defineFeature(({ prefix, requestMemory }) => {
  const reminders = requestMemory<Reminder>(
    '5a834c35-7c00-43c6-9d79-5ae7aef9f755'
  );

  const tickInterval = 24000;
  setTimeout(function tick() {
    const now = Date.now();
    reminders.entries().forEach(([key, reminder]) => {
      if (now < reminder.dueAt) {
        return;
      }

      reminder.handler();
      reminders.delete(key);
    });
    setTimeout(tick, tickInterval);
  }, tickInterval);

  return {
    matcher: new RegExp(`^${prefix}remind$`),
    onCommand: async (ctx, _match, args) => {
      if (ctx.type !== 'CHANNEL') {
        return;
      }

      if (args.length < 2) {
        await useage(ctx);
        return;
      }

      const offset = Number(args[0]);
      if (Number.isNaN(offset) || offset < 0) {
        await useage(ctx);
        return;
      }

      const dueAt = Date.now() + offset * 60000;
      const message = args.slice(1).join(' ');

      reminders.set(Math.random().toString(), {
        dueAt,
        handler: () => {
          void ctx.post(`<@!${ctx.author.id}> リマインダー ${message}`);
        },
      });

      await ctx.reply('リマインダーを設定しました');
    },
  };
});
