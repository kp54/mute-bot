const Action = {
  Usage: 'Usage',
  Add: 'Add',
  List: 'List',
  Delete: 'Delete',
} as const;

// tuple type helper
const t = <T extends ReadonlyArray<unknown>>(...value: T) => value;

export const parse = (args: string[]) => {
  const usage = t(Action.Usage);

  if (args.length === 0 || args[0] === 'help') {
    return usage;
  }

  const [command, ...rest] = args;

  if (command === 'after' && 1 < rest.length) {
    const minute = Number(rest[0]);
    if (Number.isNaN(minute) || minute < 0) {
      return usage;
    }

    const dueAt = Date.now() + minute * 60000;
    const content = rest.slice(1).join(' ');

    return t(Action.Add, dueAt, content);
  }

  if (command === 'at' && 1 < rest.length) {
    const dueAt = Date.parse(rest[0]);
    if (Number.isNaN(dueAt) || dueAt < Date.now()) {
      return usage;
    }

    const content = rest.slice(1).join(' ');

    return t(Action.Add, dueAt, content);
  }

  if (command === 'list') {
    return t(Action.List);
  }

  if (command === 'delete') {
    const indexes = rest.map((x) => Number.parseInt(x, 10));
    return t(Action.Delete, indexes);
  }

  return usage;
};

export default {
  parse,
};
