const Action = {
  Usage: 'Usage',
  Add: 'Add',
  List: 'List',
  Delete: 'Delete',
  Error: 'Error',
} as const;

const exist: <T>(value: T | null | undefined) => asserts value is T = (
  value
) => {
  if (value === null || value === undefined) {
    throw new Error('assertion failed');
  }
};

const isValidTime = (hour: number, minute: number, second: number) => {
  if (hour < 0 || 23 < hour) {
    return false;
  }

  if (minute < 0 || 59 < minute) {
    return false;
  }

  if (second < 0 || 59 < second) {
    return false;
  }

  return true;
};

const parseDateTime = (line: string) => {
  let match: RegExpMatchArray | null;

  match = line.match(
    /^(?<hour>[0-9]{1,2}):(?<minute>[0-9]{1,2}):(?<second>[0-9]{1,2})$/
  );
  if (match !== null) {
    exist(match.groups);
    const { _hour, _minute, _second } = match.groups;

    const hour = Number(_hour);
    const minute = Number(_minute);
    const second = Number(_second);

    if (!isValidTime(hour, minute, second)) {
      return null;
    }

    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(second);

    return date;
  }

  match = line.match(/^(?<hour>[0-9]{1,2}):(?<minute>[0-9]{1,2})$/);
  if (match !== null) {
    exist(match.groups);
    const { _hour, _minute } = match.groups;

    const hour = Number(_hour);
    const minute = Number(_minute);
    const second = 0;

    if (!isValidTime(hour, minute, second)) {
      return null;
    }

    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(second);

    return date;
  }
};

// tuple type helper
const t = <T extends ReadonlyArray<unknown>>(...value: T) => value;

export const parse = (args: string[]) => {
  const usage = t(Action.Usage);
  const error = t(Action.Error);

  if (args.length === 0 || args[0] === 'help') {
    return usage;
  }

  const [command, ...rest] = args;

  if (command === 'after' && 1 < rest.length) {
    const minute = Number(rest[0]);
    if (Number.isNaN(minute) || minute < 0) {
      return error;
    }

    const dueAt = Date.now() + minute * 60000;
    const content = rest.slice(1).join(' ');

    return t(Action.Add, dueAt, content);
  }

  if (command === 'at' && 1 < rest.length) {
    const dueAt = Date.parse(rest[0]);
    if (Number.isNaN(dueAt) || dueAt < Date.now()) {
      return error;
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
