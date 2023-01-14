import {
  PokemonType, pokemonTypes, typeMatrix, TypeResistance,
} from './constants.js';

export const combineTypes = (type1: PokemonType, type2: PokemonType): TypeResistance => {
  const resistance1 = typeMatrix[type1];
  const resistance2 = typeMatrix[type2];

  const combined = (
    Object.fromEntries(pokemonTypes.map((x) => [x, 1]))
  ) as { [K in PokemonType]: number };

  const apply = (key: PokemonType, factor: number) => {
    combined[key] *= factor;
  };

  resistance1.weakness.forEach((x) => apply(x, 2));
  resistance1.resistance.forEach((x) => apply(x, 0.5));
  resistance1.immunity.forEach((x) => apply(x, 0));

  resistance2.weakness.forEach((x) => apply(x, 2));
  resistance2.resistance.forEach((x) => apply(x, 0.5));
  resistance2.immunity.forEach((x) => apply(x, 0));

  const result = {
    weakness: new Array<PokemonType>(),
    resistance: new Array<PokemonType>(),
    immunity: new Array<PokemonType>(),
  };

  pokemonTypes.forEach((x) => {
    const rate = combined[x];

    switch (true) {
      case rate === 0:
        result.immunity.push(x);
        break;

      case rate < 1:
        result.resistance.push(x);
        break;

      case 1 < rate:
        result.weakness.push(x);
        break;

      default:
        break;
    }
  });

  return result;
};

export default {};
