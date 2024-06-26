import fs from "node:fs";
import type { Memory } from "./types.js";

const PATH = "./memory.json";
const TMPPATH = `${PATH}.tmp` as const;
const INTERVAL = 100;

type Storage = Record<string, Container | undefined>;
type Container = Record<string, Unit<unknown> | undefined>;
type Unit<T> = Record<string, T | undefined>;

const loadStorage = (): Storage => {
	let raw: string | null = null;
	try {
		raw = fs.readFileSync(PATH, { encoding: "utf-8" });
	} catch (e) {
		if (e instanceof Error && "code" in e && e.code === "ENOENT") {
			return Object.create(null);
		}
		throw e;
	}

	return JSON.parse(raw);
};

const saveStorage = (storage: Storage) => {
	const raw = JSON.stringify(storage);
	fs.writeFileSync(TMPPATH, raw, { encoding: "utf-8" });
	fs.renameSync(TMPPATH, PATH);
};

const connectStorageInner = () => {
	const storage = loadStorage();

	const state = {
		isDirty: false,
	};

	setTimeout(function loop() {
		if (!state.isDirty) {
			setTimeout(loop, INTERVAL);
			return;
		}

		saveStorage(storage);
		state.isDirty = false;
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

let storage: {
	getMemory: <T>(guildId: string, unitId: string) => Memory<T>;
} | null = null;

export const connectStorage = () => {
	storage ??= connectStorageInner();
	return storage;
};
