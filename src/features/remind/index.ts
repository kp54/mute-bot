import { defineFeature } from '../../core/feature.js';
import { parse } from './parser.js';

declare module '../../core/types' {
  interface Config {
    remind: {
      interval: number;
      timezone: number;
    };
  }
}

type Reminder = {
  dueAt: number;
  channelId: string;
  authorId: string;
  message: string;
};

const formatDue = (unixtime: number) => {
  const date = new Date(unixtime);

  const f = (x: number, l: number) => x.toString().padStart(l, '0');

  const year = f(date.getFullYear(), 4);
  const month = f(date.getMonth() + 1, 2);
  const day = f(date.getDay(), 2);

  const hour = f(date.getHours(), 2);
  const minute = f(date.getMinutes(), 2);
  const second = f(date.getSeconds(), 2);

  return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
};

export default defineFeature((setup) => {
  const memory = setup.requestMemory<Reminder>(
    '5a834c35-7c00-43c6-9d79-5ae7aef9f755'
  );

  const { interval } = setup.config.remind;
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

          await ctx.reply(`${formatDue(dueAt)} にリマインダーを設定しました`);

          return;
        }

        case 'List': {
          const lines = (await byAuthor(ctx.author.id)).map(
            ([_key, reminder], i) =>
              `${i}: ${formatDue(reminder.dueAt)}: ${reminder.message}`
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

          return;

        case 'Error':
          // prettier-ignore
          await ctx.reply(
            [
              'パースエラー',
              '`/remind help` でガイドを表示します',
            ].join('\n')
          );

          return;

        default:
          throw new Error();
      }
    },
  };
});
