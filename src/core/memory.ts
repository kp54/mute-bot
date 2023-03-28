import fs from 'fs';

const PATH = './memory.json';
const TMPPATH = `${PATH}.tmp` as const;
const INTERVAL = 100;

type Entry<T> = Record<string, T>;
type Container = Record<string, Entry<unknown> | undefined>;

type Storage = {
  get: <T>(key: string) => Promise<Entry<T>>;
  set: <T>(key: string, value: Entry<T>) => Promise<void>;
};

const loadContainer = (): Container => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let raw: any = null;
  try {
    raw = fs.readFileSync(PATH, { encoding: 'utf-8' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      return Object.create(null);
    }
    throw e;
  }

  return JSON.parse(raw);
};

const saveContainer = (container: Container) => {
  const raw = JSON.stringify(container);
  fs.writeFileSync(TMPPATH, raw, { encoding: 'utf-8' });
  fs.renameSync(TMPPATH, PATH);
};

export const connectStorage = (): Storage => {
  const container = loadContainer();

  const state = {
    isDirty: false,
  };

  setTimeout(function loop() {
    if (!state.isDirty) {
      setTimeout(loop, INTERVAL);
      return;
    }

    saveContainer(container);
    state.isDirty = false;
    setTimeout(loop, INTERVAL);
  }, INTERVAL);

  const get = async <T>(key: string): Promise<Entry<T>> =>
    container[key] ?? Object.create(null);

  const set = async <T>(key: string, value: Entry<T>): Promise<void> => {
    container[key] = value;
    state.isDirty = true;
  };

  return {
    get,
    set,
  };
};

export default { connectStorage };
