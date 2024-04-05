import type { Config, FeatureFactory } from "../types.js";

export type WorkerData = {
	path: string;
	config: Config;
};

export type FeatureModule = {
	default: FeatureFactory;
};
