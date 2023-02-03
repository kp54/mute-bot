import fs from 'fs/promises';

const PATH = './memory.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Entry = Record<string, any>;
type Container = Record<string, Entry | undefined>;

type Storage = {
  get: (key: string) => Promise<Entry>;
  set: (key: string, value: Entry) => Promise<void>;
};

// TODO: performance improvement

export const connectStorage = (): Storage => {
  const loadStorage = async (): Promise<Container> => {
    try {
      const file = await fs.readFile(PATH, { encoding: 'utf-8' });
      return JSON.parse(file);
    } catch {
      return Object.create(null);
    }
  };

  const saveStorage = async (container: Container) => {
    await fs.writeFile(PATH, JSON.stringify(container), { encoding: 'utf-8' });
  };

  const get = async (key: string) => {
    const container = await loadStorage();
    return container[key] ?? (Object.create(null) as Entry);
  };

  const set = async (key: string, value: Entry) => {
    const container = await loadStorage();
    container[key] = value;
    await saveStorage(container);
  };

  return {
    get,
    set,
  };
};

export default { connectStorage };
