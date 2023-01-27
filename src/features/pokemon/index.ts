import { defineFeature } from '../../core/feature.js';
import { pokemonTypes, typeResistances } from './constants.js';
import {
  combineResistances,
  prettyFormatResistance,
  randomType,
} from './core.js';

export default defineFeature(() => ({
  matcher: /pt/,
  onCommand: (ctx, _match, _args) => {
    const [type1, type2] = randomType();

    if (type2 === null) {
      const id = pokemonTypes.indexOf(type1);
      const resistance = typeResistances[id];
      const lines = [
        prettyFormatResistance(resistance),
        `正解: || ${type1} ||`,
      ];
      ctx.reply(lines.join(''));
      return;
    }

    const resistance = combineResistances(type1, type2);
    const lines = [
      prettyFormatResistance(resistance),
      `正解: || ${type1}/${type2} ||`,
    ];
    ctx.reply(lines.join(''));
  },
}));
