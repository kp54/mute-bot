import { defineFeature } from '../../core/feature.js';
import { ChannelCommandContext } from '../../core/types.js';

type Reminder = {
  dueAt: number;
  channelId: string;
  authorId: string;
  message: string;
};

const useage = async (ctx: ChannelCommandContext) => {
  await ctx.reply('構文: remind <minute> <message>');
};

export default defineFeature((setup) => {
  const reminders = setup.requestMemory<Reminder>(
    '5a834c35-7c00-43c6-9d79-5ae7aef9f755'
  );

  const tickInterval = 24000;
  setTimeout(function tick() {
    const now = Date.now();
    reminders.entries().forEach(([key, reminder]) => {
      if (now < reminder.dueAt) {
        return;
      }

      void setup.post(
        reminder.channelId,
        `<@!${reminder.authorId}> リマインダー ${reminder.message}`
      );

      reminders.delete(key);
    });
    setTimeout(tick, tickInterval);
  }, tickInterval);

  return {
    matcher: new RegExp(`^${setup.prefix}remind$`),
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
        channelId: ctx.channelId,
        authorId: ctx.author.id,
        message,
      });

      await ctx.reply('リマインダーを設定しました');
    },
  };
});
