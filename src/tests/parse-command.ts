import { parseCommand } from '../core/client/parse-command.js';

const cases: [string, readonly string[]][] = [
  [`a s d f`, ['a', 's', 'd', 'f']],
  [`a ' s ' d`, ['a', ' s ', 'd']],
  [`'a " s ' d`, ['a " s ', 'd']],
  [`' a '  s  d`, [' a ', 's', 'd']],
  [`' a '  s  d`, [' a ', 's', 'd']],
  [` `, []],
  [`' '`, [' ']],
  [`''`, ['']],
  [`'  '  "  "  '  '`, ['  ', '  ', '  ']],
  [`who's who`, [`who's`, 'who']],
];

const zip = <T, U>(
  xs: ReadonlyArray<T>,
  ys: ReadonlyArray<U>,
): Array<[T, U]> => {
  const length = Math.min(xs.length, ys.length);
  return Array(length)
    .fill(0)
    .map((_, i) => [xs[i], ys[i]]);
};

export const testParseCommand = () => {
  // eslint-disable-next-line no-console
  console.log('testing for parseCommand:');

  cases.forEach(([input, expected]) => {
    const actual = parseCommand(input);

    const fail = () =>
      // eslint-disable-next-line no-console
      console.log(
        [
          '[FAIL]',
          `input: ${JSON.stringify(input)},`,
          `expected: ${JSON.stringify(expected)},`,
          `actual: ${JSON.stringify(actual)}`,
        ].join(' '),
      );
    const pass = () =>
      // eslint-disable-next-line no-console
      console.log(
        [
          '[PASS]',
          `input: ${JSON.stringify(input)},`,
          `result: ${JSON.stringify(actual)}`,
        ].join(' '),
      );

    if (actual === null && expected === null) {
      pass();
      return;
    }

    if (actual === null || expected === null) {
      fail();
      return;
    }

    if (actual.length !== expected.length) {
      fail();
      return;
    }

    if (zip(actual, expected).some(([x, y]) => x !== y)) {
      fail();
      return;
    }

    pass();
  });
};

export default { testParseCommand };
