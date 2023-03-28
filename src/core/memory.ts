import fs from 'fs';

const PATH = './memory.json';
const TMPPATH = `${PATH}.tmp` as const;
const INTERVAL = 100;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Entry = Record<string, any>;
type Container = Record<string, Entry | undefined>;

type Storage = {
  get: (key: string) => Promise<Entry>;
  set: (key: string, value: Entry) => Promise<void>;
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

  const get = async (key: string): Promise<Entry> =>
    container[key] ?? Object.create(null);

  const set = async (key: string, value: Entry): Promise<void> => {
    container[key] = value;
    state.isDirty = true;
  };

  return {
    get,
    set,
  };
};

export default { connectStorage };
