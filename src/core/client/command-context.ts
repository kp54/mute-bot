import {
	ChannelType,
	DiscordAPIError,
	type Message,
	type PublicThreadChannel,
	RESTJSONErrorCodes,
	type TextChannel,
} from "discord.js";
import type {
	ChannelCommandContext,
	CommandContext,
	ThreadCommandContext,
} from "../types.js";

const createThreadCommandContext = (
	message: Message,
	channel: PublicThreadChannel,
): ThreadCommandContext => {
	const author = {
		id: message.author.id,
		username: message.author.username,
	};

	const post = async (text: string) => {
		await channel.send(text);
	};

	const archive = async () => {
		await channel.setArchived(true);
	};

	return {
		type: "THREAD",
		threadId: channel.id,
		author,
		post,
		archive,
	};
};

const createChannelCommandContext = (
	message: Message,
	channel: TextChannel,
): ChannelCommandContext => {
	const author = {
		id: message.author.id,
		username: message.author.username,
	};

	const reply = async (text: string) => {
		await message.reply(text);
	};

	const post = async (text: string) => {
		await channel.send(text);
	};

	const threadify = async (name: string): Promise<ThreadCommandContext> => {
		try {
			await message.startThread({ name });
		} catch (e: unknown) {
			if (
				e instanceof DiscordAPIError &&
				e.code === RESTJSONErrorCodes.InvalidMessageType
			) {
				// thread already created
			} else {
				throw new Error("failed to create thread.", { cause: e });
			}
		}

		const { thread } = message;
		if (thread?.type !== ChannelType.PublicThread) {
			throw new Error("failed to create thread.");
		}

		return createThreadCommandContext(message, thread);
	};

	return {
		type: "CHANNEL",
		channelId: message.channel.id,
		author,
		reply,
		post,
		threadify,
	};
};

export const createCommandContext = (
	message: Message,
): CommandContext | null => {
	if (message.channel.type === ChannelType.GuildText) {
		const { channel } = message;
		return createChannelCommandContext(message, channel);
	}

	if (message.channel.type === ChannelType.PublicThread) {
		const { channel } = message;
		return createThreadCommandContext(message, channel);
	}

	return null;
};
