import { defineFeature } from '../../core/feature.js';
import parse from './parser.js';

const usage = (prefix: string) =>
  [
    '```',
    `使い方`,
    ``,
    `${prefix}transponder list`,
    `  自動応答の一覧を表示`,
    ``,
    `${prefix}transponder set <query> <answer>`,
    `  自動応答を設定`,
    ``,
    `${prefix}transponder unset <query>`,
    `  自動応答を解除`,
    ``,
    `${prefix}transponder [help]`,
    `  このガイドを表示`,
    '```',
  ].join('\n');

export default defineFeature((setupCtx) => {
  const { prefix } = setupCtx.config.core;
  const memory = setupCtx.requestMemory<string>(
    'd91d7e6d-f5bd-4ce3-b54c-d42aa4e4106e'
  );

  return {
    name: 'transponder',

    summary: '自動応答',

    usage: usage(prefix),

    matcher: new RegExp(`(?<manage>^${prefix}transponder$)|(^.)`),

    onCommand: async (ctx, command) => {
      if (ctx.type !== 'CHANNEL') {
        return;
      }

      const isManage = command.match.groups?.manage !== undefined;
      if (!isManage) {
        const resp = await memory.get(command.line);
        if (resp !== undefined) {
          await ctx.reply(resp);
        }
        return;
      }

      const [action, query, answer] = parse(command.args);
      switch (action) {
        case 'Usage': {
          await ctx.reply(usage(prefix));
          return;
        }

        case 'List': {
          const items = await memory.entries();

          if (items.length === 0) {
            await ctx.reply('自動応答がありません');
            return;
          }

          const lines = [
            '```',
            ...items.map(([key, value]) => `${key} : ${value}`),
            '```',
          ];
          await ctx.reply(lines.join('\n'));
          return;
        }

        case 'Set': {
          await memory.set(query, answer);
          await ctx.reply('自動応答を設定しました');
          return;
        }

        case 'Unset': {
          await memory.delete(query);
          await ctx.reply('自動応答を解除しました');
          return;
        }

        case 'Error': {
          const lines = [
            'エラー',
            `\`${prefix}transponder help\` でガイドを表示します`,
          ];
          await ctx.reply(lines.join('\n'));
          return;
        }

        default:
          throw new Error();
      }
    },
  };
});
