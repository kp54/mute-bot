import { ChannelType, type Message, type TextChannel } from "discord.js";
import type { ChannelCommandContext, CommandContext } from "../types.js";

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

	return {
		type: "CHANNEL",
		channelId: message.channel.id,
		author,
		reply,
		post,
	};
};

export const createCommandContext = (
	message: Message,
): CommandContext | null => {
	if (message.channel.type === ChannelType.GuildText) {
		const { channel } = message;
		return createChannelCommandContext(message, channel);
	}

	// TODO
	// if (message.channel.type === ChannelType.PublicThread) {
	// 	const { channel } = message;
	// 	return createThreadCommandContext(message, channel);
	// }

	return null;
};
