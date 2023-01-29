import { defineFeature } from '../../core/feature.js';
import { CommandContext } from '../../core/types.js';

const DIGITS = 4;

type Game = {
  attempts: number;
  answer: string[];
};

type Games = Map<string, Game>;

const genName = () => {
  const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const code = Array(4)
    .fill(0)
    .map(() => {
      const index = Math.trunc(Math.random() * alphabets.length);
      return alphabets[index];
    })
    .join('');

  return `Hit and Blow : ${code}`;
};

const newGame = (): Game => ({
  attempts: 0,
  answer: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    .sort(() => Math.random() - 0.5)
    .slice(0, DIGITS),
});

const validate = (attempt: string) => {
  const used = new Set<string>();
  // eslint-disable-next-line no-restricted-syntax
  for (const c of attempt) {
    if (used.has(c)) {
      return false;
    }
    used.add(c);
  }
  return true;
};

const handleInit = async (ctx: CommandContext, games: Games) => {
  if (games.has(ctx.channelId)) {
    games.delete(ctx.channelId);
    await ctx.post('ゲームを破棄しました');
    return;
  }

  const threadCtx = await ctx.threadify(genName());

  games.set(threadCtx.channelId, newGame());
  await threadCtx.post(
    ['** hit and blow **', '4桁の10進数を入力してください'].join('\n')
  );
};

const handleAttempt = async (
  ctx: CommandContext,
  games: Games,
  attempt: string
) => {
  const game = games.get(ctx.channelId);
  if (game === undefined) {
    return;
  }

  const threadCtx = await ctx.threadify(genName());

  if (!validate(attempt)) {
    await threadCtx.post('エラー');
    return;
  }

  game.attempts += 1;

  const symbols = new Set(game.answer);
  const result = {
    hit: 0,
    blow: 0,
  };
  for (let i = 0; i < DIGITS; i += 1) {
    if (game.answer[i] === attempt[i]) {
      result.hit += 1;
    } else if (symbols.has(attempt[i])) {
      result.blow += 1;
    }
  }

  if (result.hit === DIGITS) {
    await threadCtx.post(['正解', `試行回数: ${game.attempts}`].join('\n'));
    games.delete(threadCtx.channelId);
    return;
  }

  await threadCtx.post(`Hit: ${result.hit}, Blow: ${result.blow}`);
};

export default defineFeature(() => {
  const games = new Map<string, Game>();

  return {
    matcher: ({ prefix }) =>
      new RegExp(`(?<init>^${prefix}hb$)|(?<attempt>^[0-9]{${DIGITS}}$)`),
    onCommand: async (ctx, match) => {
      if (match.groups?.init !== undefined) {
        await handleInit(ctx, games);
        return;
      }

      const attempt = match.groups?.attempt;
      if (attempt !== undefined) {
        await handleAttempt(ctx, games, attempt);
      }
    },
  };
});
