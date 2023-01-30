import { defineFeature } from '../../core/feature.js';
import { ChannelCommandContext } from '../../core/types.js';

type Reminder = {
  dueAt: number;
  handler: () => void;
};

const useage = async (ctx: ChannelCommandContext) => {
  await ctx.reply('構文: remind <minute> <message>');
};

export default defineFeature(() => {
  const reminders = {
    value: new Array<Reminder>(),
  };

  const tickInterval = 64000;
  setTimeout(function tick() {
    const now = Date.now();
    reminders.value = reminders.value.filter((reminder) => {
      if (now < reminder.dueAt) {
        return true;
      }

      reminder.handler();
      return false;
    });
    setTimeout(tick, tickInterval);
  }, tickInterval);

  return {
    matcher: ({ prefix }) => new RegExp(`^${prefix}remind$`),
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

      reminders.value.push({
        dueAt,
        handler: () => {
          void ctx.post(`<@!${ctx.author.id}> リマインダー ${message}`);
        },
      });

      await ctx.reply('リマインダーを設定しました');
    },
  };
});
