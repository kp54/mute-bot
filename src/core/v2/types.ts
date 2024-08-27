import type { Client, Message } from "discord.js";

export type FeatureId = {
	id: string;
	name: string;
};

export type FeatureDescription = {
	summary: string | null;
	usage: string | null;
};

export type FeatureInstance = FeatureId & {
	describe: () => Promise<FeatureDescription>;
	onMessage: (message: Message) => Promise<void>;
};

export type FeatureBuilder = FeatureId & {
	build: (
		config: Config,
		logger: Logger,
		client: Client,
		unregister: () => void,
	) => Promise<FeatureInstance>;
};

export type CreateClientOptions = {
	config: Config;
	features: FeatureBuilder[];
	logger: Logger;
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

export type SetupContext = {
	config: Config;
};

export type ChannelCommandContext = {
	type: "CHANNEL";
	channelId: string;
	author: {
		id: string;
		username: string;
	};
	reply: (message: string) => Promise<void>;
	post: (message: string) => Promise<void>;
	// threadify: (name: string) => Promise<ThreadCommandContext>;
};

// TODO
// export type ThreadCommandContext = {
// 	type: "THREAD";
// 	threadId: string;
// 	author: {
// 		id: string;
// 		username: string;
// 	};
// 	post: (message: string) => Promise<void>;
// 	archive: () => Promise<void>;
// };

// export type CommandContext = ChannelCommandContext | ThreadCommandContext;

export type CommandContext = ChannelCommandContext;

export type CommandBody = {
	match: RegExpMatchArray;
	args: string[];
	content: string;
	line: string;
};
