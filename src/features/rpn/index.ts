import { defineFeature } from '../../core/feature.js';
import { evaluate } from './core.js';

export default defineFeature(({ config }) => ({
  matcher: new RegExp(`${config.core.prefix}rpn`),
  onCommand: async (ctx, _match, args) => {
    const result = evaluate(args);

    switch (result[0]) {
      case 'Ok': {
        const [_type, value] = result;
        await ctx.post(`OK: ${value}`);

        return;
      }

      case 'Bottom': {
        const [_type, index] = result;
        await ctx.post(`ERR: ${index}: Insufficient stack.`);

        return;
      }

      case 'NaN': {
        const [_type, index] = result;
        await ctx.post(`ERR: ${index}: Encountered NaN.`);

        return;
      }

      case 'Empty': {
        await ctx.post(
          [
            '```',
            '演算',
            '',
            '+ add',
            '  二項演算子 `x + y` をスタックに追加',
            '',
            '- sub',
            '  二項演算子 `x - y` をスタックに追加',
            '',
            '* mul',
            '  二項演算子 `x * y` をスタックに追加',
            '',
            '/ div',
            '  二項演算子 `x / y` をスタックに追加',
            '',
            '% divmod',
            '  二項演算子 `x // y`, `x % y` をスタックに追加',
            '',
            '_ drop',
            '  単項演算子 なにもしない',
            '',
            '= dup',
            '  単項演算子 `x`, `x` をスタックに追加',
            '```',
          ].join('\n')
        );

        return;
      }

      default:
        throw new Error();
    }
  },
}));
