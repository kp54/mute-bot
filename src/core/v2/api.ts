import type { FeatureMeta } from "./types.js";

export type FeatureApi = {
	initialize: () => FeatureMeta;
	onMessage: () => void;
};

export type HostApi = {
	saveMemory: () => void;
	loadMemory: () => void;
};
