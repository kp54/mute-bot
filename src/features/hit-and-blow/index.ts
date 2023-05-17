import { defineFeature } from '../../core/feature.js';
import { CommandContext, Memory } from '../../core/types.js';

const DIGITS = 4;

type Game = {
  attempts: number;
  answer: string[];
};

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

const handleInit = async (ctx: CommandContext, games: Memory<Game>) => {
  if (ctx.type === 'CHANNEL') {
    const threadCtx = await ctx.threadify(genName());

    await games.set(threadCtx.threadId, newGame());
    await threadCtx.post(
      ['** hit and blow **', '4桁の10進数を入力してください'].join('\n')
    );

    return;
  }

  if ((await games.get(ctx.threadId)) === undefined) {
    return;
  }

  await games.delete(ctx.threadId);
  await ctx.post('ゲームを破棄しました');
  await ctx.archive();
};

const handleAttempt = async (
  ctx: CommandContext,
  games: Memory<Game>,
  attempt: string
) => {
  if (ctx.type !== 'THREAD') {
    return;
  }

  const game = await games.get(ctx.threadId);
  if (game === undefined) {
    return;
  }

  if (!validate(attempt)) {
    await ctx.post('エラー');
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
    await ctx.post(['正解', `試行回数: ${game.attempts}`].join('\n'));
    await games.delete(ctx.threadId);
    await ctx.archive();
    return;
  }

  await ctx.post(`Hit: ${result.hit}, Blow: ${result.blow}`);
  await games.set(ctx.threadId, game);
};

export default defineFeature(({ config, requestMemory }) => {
  const games = requestMemory<Game>('a0073f1c-0603-43b9-867b-81e54289d6d5');

  return {
    matcher: new RegExp(
      `(?<init>^${config.core.prefix}hb$)|(?<attempt>^[0-9]{${DIGITS}}$)`
    ),
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
