import { CommandContext, defineFeature } from '../../core/feature.js';

const DIGITS = 4;
const matcher = new RegExp(`^(?<init>hb)|(?<attempt>[0-9]{${DIGITS}})$`);

type Game = {
  attempts: number;
  answer: string[];
};

type Games = Map<string, Game>;

const newGame = (): Game => ({
  attempts: 0,
  answer: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    .sort(() => Math.random() - 0.5)
    .slice(0, DIGITS),
});

const mention = (id: string, message: string) => `<@!${id}> ${message}`;

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

const handleInit = (ctx: CommandContext, games: Games) => {
  const authorId = ctx.author.id;

  if (games.has(authorId)) {
    games.delete(authorId);
    ctx.post(mention(authorId, 'ゲームを破棄しました'));
    return;
  }

  games.set(authorId, newGame());
  ctx.post(
    [
      '** hit and blow **',
      mention(authorId, '4桁の10進数を入力してください'),
    ].join('\n')
  );
};

const handleAttempt = (ctx: CommandContext, game: Game, attempt: string) => {
  const authorId = ctx.author.id;

  if (!validate(attempt)) {
    ctx.post(mention(authorId, 'エラー'));
  }

  // eslint-disable-next-line no-param-reassign
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
    ctx.post(
      [mention(authorId, '正解'), `試行回数: ${game.attempts}`].join('\n')
    );
    return;
  }

  ctx.post(mention(authorId, `Hit: ${result.hit}, Blow: ${result.blow}`));
};

export default defineFeature(() => {
  const games = new Map<string, Game>();

  return {
    matcher,
    onCommand: (ctx, match) => {
      if (match.groups?.init !== undefined) {
        handleInit(ctx, games);
        return;
      }

      const game = games.get(ctx.author.id);
      if (game === undefined) {
        return;
      }

      const attempt = match.groups?.attempt;
      if (attempt === undefined) {
        throw new Error('something went wrong.');
      }

      handleAttempt(ctx, game, attempt);
    },
  };
});
