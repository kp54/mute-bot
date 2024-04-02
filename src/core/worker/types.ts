import type { Config, FeatureFactory } from "../types.js";

export type WorkerData = {
	path: string;
	config: Config;
};

export type FeatureModule = {
	default: FeatureFactory;
};

export type Message = {
	kind: "request" | "response";
	requestId: string;
	payload: unknown;
};

// biome-ignore lint/suspicious/noExplicitAny:
export type MessageHandler = (payload: any) => Promise<any>;

export type Pipe = {
	// biome-ignore lint/suspicious/noExplicitAny:
	post: (payload: any) => Promise<any>;
};
