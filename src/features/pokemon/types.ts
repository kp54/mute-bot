import type { pokemonTypes } from "./constants.ts";

export type PokemonType = (typeof pokemonTypes)[number];
