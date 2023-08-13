import fs from 'fs';
import { Memory } from './types.js';

const PATH = './memory.json';
const TMPPATH = `${PATH}.tmp` as const;
const INTERVAL = 100;

type Storage = Record<string, Container | undefined>;
type Container = Record<string, Unit<unknown> | undefined>;
type Unit<T> = Record<string, T | undefined>;

const loadStorage = (): Storage => {
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

const saveStorage = (storage: Storage) => {
  const raw = JSON.stringify(storage);
  fs.writeFileSync(TMPPATH, raw, { encoding: 'utf-8' });
  fs.renameSync(TMPPATH, PATH);
};

export const connectStorage = () => {
  const storage = loadStorage();

  const state = {
    isDirty: false,
  };

  // eslint-disable-next-line no-restricted-globals
  setTimeout(function loop() {
    if (!state.isDirty) {
      // eslint-disable-next-line no-restricted-globals
      setTimeout(loop, INTERVAL);
      return;
    }

    saveStorage(storage);
    state.isDirty = false;
    // eslint-disable-next-line no-restricted-globals
    setTimeout(loop, INTERVAL);
  }, INTERVAL);

  const getUnit = async <T>(
    guildId: string,
    unitId: string,
  ): Promise<Unit<T>> => {
    const container = storage[guildId];
    if (container === undefined) {
      return {};
    }

    return (container[unitId] as Unit<T>) ?? {};
  };

  const setUnit = async <T>(
    guildId: string,
    unitId: string,
    unit: Unit<T>,
  ): Promise<void> => {
    const container = storage[guildId] ?? {};

    container[unitId] = unit;
    storage[guildId] = container;

    state.isDirty = true;
  };

  const getMemory = <T>(guildId: string, unitId: string): Memory<T> => ({
    get: async (key: string) => {
      const unit = await getUnit<T>(guildId, unitId);
      return structuredClone(unit[key]);
    },
    set: async (key: string, value: T) => {
      const unit = await getUnit(guildId, unitId);
      unit[key] = structuredClone(value);
      await setUnit(guildId, unitId, unit);
    },
    delete: async (key: string) => {
      const unit = await getUnit(guildId, unitId);
      delete unit[key];
      await setUnit(guildId, unitId, unit);
    },
    entries: async () => {
      const unit = await getUnit<T>(guildId, unitId);
      return Object.entries(unit).filter(
        (x): x is [string, T] => x[1] !== undefined,
      );
    },
  });

  return {
    getMemory,
  };
};

export default { connectStorage };
