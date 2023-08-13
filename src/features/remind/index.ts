import { DateTime } from 'luxon';
import { defineFeature } from '../../core/feature.js';
import { parse } from './parser.js';

declare module '../../core/types' {
  interface Config {
    remind: {
      interval: number;
      timezone: string;
    };
  }
}

type Reminder = {
  dueAt: number;
  channelId: string;
  authorId: string;
  message: string;
};

const formatDue = (timezone: string, unixtime: number) =>
  DateTime.fromMillis(unixtime)
    .setZone(timezone)
    .setLocale('ja-JP')
    .toLocaleString(DateTime.DATETIME_FULL);

const sanitize = (line: string) =>
  line.replaceAll('```', '`').replaceAll('\n', ' ');

const usage = (prefix: string) =>
  [
    '```',
    '使い方',
    '',
    `${prefix}remind after <minute> <content>`,
    ' リマインダーを <minute> 分後に設定',
    '',
    `${prefix}remind at <datetime> <content>`,
    '  リマインダーを <datetime> に設定',
    '',
    `${prefix}remind list`,
    '  リマインダーの一覧を表示',
    '',
    `${prefix}remind delete <index>`,
    '  リマインダーを削除',
    '',
    `${prefix}remind [help]`,
    '  このガイドを表示',
    '```',
  ].join('\n');

export default defineFeature(
  ({ config, requestMemory, requestTimers, post }) => {
    const memory = requestMemory<Reminder>(
      '5a834c35-7c00-43c6-9d79-5ae7aef9f755',
    );

    const timers = requestTimers('remind');

    const { interval } = config.remind;
    const tick = async (): Promise<void> => {
      const now = Date.now();
      const entries = await memory.entries();

      await Promise.all(
        entries.map(async ([key, reminder]) => {
          if (now < reminder.dueAt) {
            return;
          }

          await post(
            reminder.channelId,
            `<@!${reminder.authorId}> リマインダー ${reminder.message}`,
          );

          await memory.delete(key);
        }),
      );

      timers.setTimeout(() => tick(), interval);
    };
    timers.setTimeout(() => tick(), interval);

    const byAuthor = async (authorId: string) => {
      const reminders = (await memory.entries()).filter(
        ([_key, reminder]) => reminder.authorId === authorId,
      );
      return reminders ?? [];
    };

    const { prefix } = config.core;

    return {
      name: 'remind',

      summary: 'リマインダー',

      usage: usage(prefix),

      matcher: new RegExp(`^${prefix}remind$`),

      onCommand: async (ctx, command) => {
        if (ctx.type !== 'CHANNEL') {
          return;
        }

        const parsed = parse(config.remind.timezone, command.args);

        switch (parsed[0]) {
          case 'Add': {
            const [_, dueAt, message] = parsed;

            await memory.set(Math.random().toString(), {
              dueAt,
              channelId: ctx.channelId,
              authorId: ctx.author.id,
              message,
            });

            await ctx.reply(
              `${formatDue(
                config.remind.timezone,
                dueAt,
              )} にリマインダーを設定しました`,
            );

            return;
          }

          case 'List': {
            const lines = (await byAuthor(ctx.author.id)).map(
              ([_key, reminder], i) =>
                [
                  i.toString(),
                  formatDue(config.remind.timezone, reminder.dueAt),
                  sanitize(reminder.message),
                ].join(': '),
            );

            if (lines.length === 0) {
              await ctx.reply(
                ['```', 'リマインダーがありません', '```'].join('\n'),
              );

              return;
            }

            await ctx.reply(['```', ...lines, '```'].join('\n'));

            return;
          }

          case 'Delete': {
            const [_, indexes] = parsed;

            const reminders = await byAuthor(ctx.author.id);
            const toRemove = reminders.filter((_x, i) => indexes.includes(i));

            await Promise.all(
              toRemove.map(([key, _reminder]) => memory.delete(key)),
            );

            await ctx.reply('リマインダーを削除しました');

            return;
          }

          case 'Usage':
            await ctx.reply(usage(prefix));

            return;

          case 'Error':
            // prettier-ignore
            await ctx.reply(
            [
              'パースエラー',
              `\`${prefix}remind help\` でガイドを表示します`,
            ].join('\n')
          );

            return;

          case 'Past':
            await ctx.reply('過去の日時は設定できません');

            return;

          default:
            throw new Error();
        }
      },
    };
  },
);
