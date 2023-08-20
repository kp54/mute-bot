import { pokemonTypes, typeResistances } from './constants.js';
import { PokemonType } from './types.js';

export const combineResistances = (type1: PokemonType, type2: PokemonType) => {
  if (type1 === type2) {
    throw new Error('type1 is equals to type2');
  }

  const id1 = pokemonTypes.indexOf(type1);
  const id2 = pokemonTypes.indexOf(type2);

  const resistance1 = typeResistances[id1];
  const resistance2 = typeResistances[id2];

  return pokemonTypes.map((_, i) => resistance1[i] * resistance2[i]);
};

export const prettyFormatResistance = (resistance: readonly number[]) => {
  const weak: PokemonType[] = [];
  const immune: PokemonType[] = [];
  const resist: PokemonType[] = [];

  pokemonTypes.forEach((type, i) => {
    const rate = resistance[i];

    switch (true) {
      case rate === 0:
        immune.push(type);
        break;
      case rate === 1:
        break;
      case rate < 1:
        resist.push(type);
        break;
      case 1 < rate:
        weak.push(type);
        break;
      default:
        throw new Error();
    }
  });

  const lines = [];
  if (0 < weak.length) {
    lines.push(`こうかばつぐん: ${weak.join(' ')}`);
  }
  if (0 < resist.length) {
    lines.push(`いまひとつ: ${resist.join(' ')}`);
  }
  if (0 < immune.length) {
    lines.push(`こうかなし: ${immune.join(' ')}`);
  }

  return lines.join('\n');
};

export const randomType = (): [PokemonType, PokemonType | null] => {
  const [type1, type2, ..._] = [...pokemonTypes, null].sort(
    (_a, _b) => Math.random() - 0.5,
  );

  if (type1 === null) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return [type2!, null];
  }
  if (type2 === null) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return [type1!, null];
  }

  if (pokemonTypes.indexOf(type1) > pokemonTypes.indexOf(type2)) {
    return [type2, type1];
  }
  return [type1, type2];
};
