import { pokemonTypes } from './constants.js';

export type PokemonType = (typeof pokemonTypes)[number];
