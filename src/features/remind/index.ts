import { defineFeature } from '../../core/feature.js';
import { ChannelCommandContext } from '../../core/types.js';
import { parse } from './parser.js';

type Reminder = {
  dueAt: number;
  channelId: string;
  authorId: string;
  message: string;
};

const usage = async (ctx: ChannelCommandContext) => {
  await ctx.reply(
    [
      '```',
      '使い方',
      '',
      '/remind after <minute> <content>',
      ' リマインダーを <minute> 分後に設定',
      '',
      '/remind at <datetime> <content>',
      '  リマインダーを <datetime> に設定',
      '',
      '/remind list',
      '  リマインダーの一覧を表示',
      '',
      '/remind delete <index>',
      '  リマインダーを削除',
      '',
      '/remind [help]',
      '  このガイドを表示',
      '```',
    ].join('\n')
  );
};

export default defineFeature((setup) => {
  const memory = setup.requestMemory<Reminder>(
    '5a834c35-7c00-43c6-9d79-5ae7aef9f755'
  );

  const interval = 23209;
  const tick = async (): Promise<void> => {
    const now = Date.now();
    const entries = await memory.entries();

    await Promise.all(
      entries.map(async ([key, reminder]) => {
        if (now < reminder.dueAt) {
          return;
        }

        await setup.post(
          reminder.channelId,
          `<@!${reminder.authorId}> リマインダー ${reminder.message}`
        );

        await memory.delete(key);
      })
    );

    setTimeout(() => {
      void tick();
    }, interval);
  };
  setTimeout(() => {
    void tick();
  }, interval);

  const byAuthor = async (authorId: string) => {
    const reminders = (await memory.entries()).filter(
      ([_key, reminder]) => reminder.authorId === authorId
    );
    return reminders ?? [];
  };

  return {
    matcher: new RegExp(`^${setup.config.core.prefix}remind$`),
    onCommand: async (ctx, _match, args) => {
      if (ctx.type !== 'CHANNEL') {
        return;
      }

      const parsed = parse(args);

      switch (parsed[0]) {
        case 'Add': {
          const [_, dueAt, message] = parsed;

          await memory.set(Math.random().toString(), {
            dueAt,
            channelId: ctx.channelId,
            authorId: ctx.author.id,
            message,
          });

          const datetime = new Date(dueAt).toLocaleString('ja-JP');
          await ctx.reply(`${datetime} にリマインダーを設定しました`);

          return;
        }

        case 'List': {
          const lines = (await byAuthor(ctx.author.id)).map(
            ([_key, reminder], i) => `${i}: ${reminder.message}`
          );
          await ctx.reply(['```', ...lines, '```'].join('\n'));

          return;
        }

        case 'Delete': {
          const [_, indexes] = parsed;

          const reminders = await byAuthor(ctx.author.id);
          const toRemove = reminders.filter((_x, i) => indexes.includes(i));

          await Promise.all(
            toRemove.map(([key, _reminder]) => memory.delete(key))
          );

          await ctx.reply('リマインダーを削除しました');

          return;
        }

        case 'Usage':
          await usage(ctx);
          return;

        default:
          throw new Error();
      }
    },
  };
});
