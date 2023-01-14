const PokemonTypes = [
  'ノーマル',
  'ほのお',
  'みず',
  'でんき',
  'くさ',
  'こおり',
  'かくとう',
  'どく',
  'じめん',
  'ひこう',
  'エスパー',
  'むし',
  'いわ',
  'ゴースト',
  'ドラゴン',
  'あく',
  'はがね',
  'フェアリー',
] as const;

type PokemonType = (typeof PokemonTypes)[number];

type TypeResistance = {
  weakness: PokemonType[];
  resistance: PokemonType[];
  immunity: PokemonType[];
};

type TypeMatrix = {
  [K in PokemonType]: TypeResistance
};

export const typeMatrix: TypeMatrix = {
  ノーマル: {
    weakness: ['かくとう'],
    resistance: [],
    immunity: ['ゴースト'],
  },
  ほのお: {
    weakness: ['みず', 'じめん', 'いわ'],
    resistance: ['ほのお', 'くさ', 'こおり', 'むし', 'はがね', 'フェアリー'],
    immunity: [],
  },
  みず: {
    weakness: ['でんき', 'くさ'],
    resistance: ['ほのお', 'みず', 'こおり', 'はがね'],
    immunity: [],
  },
  でんき: {
    weakness: ['じめん'],
    resistance: ['でんき', 'ひこう', 'はがね'],
    immunity: [],
  },
  くさ: {
    weakness: ['ほのお', 'こおり', 'どく', 'ひこう', 'むし'],
    resistance: ['みず', 'でんき', 'くさ', 'じめん'],
    immunity: [],
  },
  こおり: {
    weakness: ['ほのお', 'かくとう', 'いわ', 'はがね'],
    resistance: ['こおり'],
    immunity: [],
  },
  かくとう: {
    weakness: ['ひこう', 'エスパー', 'フェアリー'],
    resistance: ['むし', 'いわ', 'あく'],
    immunity: [],
  },
  どく: {
    weakness: ['じめん', 'エスパー'],
    resistance: ['くさ', 'かくとう', 'どく', 'むし', 'フェアリー'],
    immunity: [],
  },
  じめん: {
    weakness: ['みず', 'くさ', 'こおり'],
    resistance: ['どく', 'いわ'],
    immunity: ['でんき'],
  },
  ひこう: {
    weakness: ['でんき', 'こおり', 'いわ'],
    resistance: ['くさ', 'かくとう', 'むし'],
    immunity: ['じめん'],
  },
  エスパー: {
    weakness: ['むし', 'ゴースト', 'あく'],
    resistance: ['かくとう', 'エスパー'],
    immunity: [],
  },
  むし: {
    weakness: ['ほのお', 'ひこう', 'いわ'],
    resistance: ['くさ', 'かくとう', 'じめん'],
    immunity: [],
  },
  いわ: {
    weakness: ['みず', 'くさ', 'かくとう', 'じめん', 'はがね'],
    resistance: ['ノーマル', 'ほのお', 'どく', 'ひこう'],
    immunity: [],
  },
  ゴースト: {
    weakness: ['ゴースト', 'あく'],
    resistance: ['どく', 'むし'],
    immunity: ['ノーマル', 'かくとう'],
  },
  ドラゴン: {
    weakness: ['こおり', 'ドラゴン', 'フェアリー'],
    resistance: ['ほのお', 'みず', 'でんき', 'くさ'],
    immunity: [],
  },
  あく: {
    weakness: ['かくとう', 'むし', 'フェアリー'],
    resistance: ['ゴースト', 'あく'],
    immunity: ['エスパー'],
  },
  はがね: {
    weakness: ['ほのお', 'かくとう', 'じめん'],
    resistance: ['ノーマル', 'くさ', 'こおり', 'ひこう', 'エスパー', 'むし', 'いわ', 'ドラゴン', 'はがね', 'フェアリー'],
    immunity: ['どく'],
  },
  フェアリー: {
    weakness: ['どく', 'はがね'],
    resistance: ['かくとう', 'むし', 'あく'],
    immunity: ['ドラゴン'],
  },
};

export default {};
