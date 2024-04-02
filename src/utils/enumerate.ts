export const enumerate = <T>(array: readonly T[]): [number, T][] =>
	array.map((x, i) => [i, x]);
