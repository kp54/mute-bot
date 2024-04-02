import {
	ChannelType,
	type Message,
	type PublicThreadChannel,
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
		const thread = await message.startThread({ name });

		const postThread = async (text: string) => {
			await thread.send(text);
		};

		const archive = async () => {
			await thread.setArchived(true);
		};

		return {
			type: "THREAD",
			threadId: thread.id,
			author,
			post: postThread,
			archive,
		};
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
