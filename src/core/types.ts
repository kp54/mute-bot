import type { Timers } from "./timers.js";

export type ChannelCommandContext = {
	type: "CHANNEL";
	channelId: string;
	author: {
		id: string;
		username: string;
	};
	reply: (message: string) => Promise<void>;
	post: (message: string) => Promise<void>;
	threadify: (name: string) => Promise<ThreadCommandContext>;
};

export type ThreadCommandContext = {
	type: "THREAD";
	threadId: string;
	author: {
		id: string;
		username: string;
	};
	post: (message: string) => Promise<void>;
	archive: () => Promise<void>;
};

export type CommandContext = ChannelCommandContext | ThreadCommandContext;
export type CommandBody = {
	match: RegExpMatchArray;
	args: string[];
	content: string;
	line: string;
};

export type FeatureId = {
	id: string;
	name: string;
};

export type FeatureInstance = {
	summary: string | null;
	usage: string | null;
	matcher: RegExp;
	onCommand: (ctx: CommandContext, command: CommandBody) => Promise<void>;
};

export type Feature = FeatureId & FeatureInstance;

export type Memory<T> = {
	get: (key: string) => Promise<T | undefined>;
	set: (key: string, value: T) => Promise<void>;
	delete: (key: string) => Promise<void>;
	entries: () => Promise<[string, T][]>;
};

export type StorageConnection = {
	getMemory: <T>(guildId: string, unitId: string) => Memory<T>;
};

export type SetupContext = {
	config: Config;
	post: (channelId: string, message: string) => Promise<void>;
	requestMemory: <T>() => Memory<T>;
	requestTimers: () => Timers;
};

export type FeatureFactory = FeatureId & {
	create: (options: SetupContext) => Feature;
};

export type CreateClientOptions = {
	config: Config;
	features?: FeatureFactory[];
	logger?: Logger;
};

export interface Config {
	core: {
		discordToken: string;
		prefix: string;
	};
}

export type Logger = {
	log: (...values: string[]) => void;
	error: (...values: string[]) => void;
};
