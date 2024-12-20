import type { Client } from "discord.js";
import { connectStorage } from "../memory.js";
import type { CreateClientOptions, Memory, SetupContext } from "../types.js";

export const createSetupContext = (
	guildId: string,
	client: Client,
	options: CreateClientOptions,
): SetupContext => {
	const post = async (channelId: string, message: string) => {
		const channel = client.channels.resolve(channelId);

		if (channel === null) {
			throw new Error(`${channelId}: no such channel.`);
		}

		if (!channel.isSendable()) {
			throw new Error(`${channelId}: the channel is not sendable.`);
		}

		await channel.send(message);
	};

	const storage = connectStorage();

	const requestMemory = <T>(id: string): Memory<T> =>
		storage.getMemory(guildId, id);

	return {
		config: options.config,
		post,
		requestMemory,
	};
};
