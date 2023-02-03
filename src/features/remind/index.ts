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

  const interval = 24000;
  const tick = async (): Promise<void> => {
    const now = Date.now();
    const entries = await reminders.entries();

    await Promise.all(
      entries.map(async ([key, reminder]) => {
        if (now < reminder.dueAt) {
          return;
        }

        await setup.post(
          reminder.channelId,
          `<@!${reminder.authorId}> リマインダー ${reminder.message}`
        );

        await reminders.delete(key);
      })
    );

    setTimeout(() => {
      void tick();
    }, interval);
  };
  setTimeout(() => {
    void tick();
  }, interval);

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

      await reminders.set(Math.random().toString(), {
        dueAt,
        channelId: ctx.channelId,
        authorId: ctx.author.id,
        message,
      });

      await ctx.reply('リマインダーを設定しました');
    },
  };
});
