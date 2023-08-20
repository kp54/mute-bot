const Action = {
  List: 'List',
  Usage: 'Usage',
  Set: 'Set',
  Unset: 'Unset',
  Error: 'Error',
} as const;

const t = <T extends ReadonlyArray<unknown>>(...value: T) => value;

export const parse = (args: string[]) => {
  if (args.length === 0) {
    return t(Action.Usage);
  }

  const [command, ...rest] = args;

  switch (command) {
    case 'list':
      return t(Action.List);

    case 'set':
      if (rest.length < 2) {
        return t(Action.Error);
      }

      return t(Action.Set, rest[0].trim(), rest[1].trim());

    case 'unset':
      if (rest.length < 1) {
        return t(Action.Error);
      }

      return t(Action.Unset, rest[0].trim());

    case 'help':
      return t(Action.Usage);

    default:
      return t(Action.Error);
  }
};
