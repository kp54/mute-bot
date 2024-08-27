import type { FeatureDescription } from "./types.js";

export type Message = {
	messageId: string;
	channelId: string;
	author: {
		id: string;
		username: string;
	};
	content: string;
};

export type FeatureApi = {
	describe: () => Promise<FeatureDescription>;
	onMessage: (message: Message) => Promise<void>;
};

export type HostApi = {
	replyMessage: (
		channelId: string,
		messageId: string,
		content: string,
	) => Promise<void>;
	postChannel: (channelId: string, content: string) => Promise<void>;
};
