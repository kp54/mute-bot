import type { Client } from "discord.js";
import { createRpcClient } from "../rpc/client.js";
import { createRpcServer } from "../rpc/server.js";
import type { RpcTransport } from "../rpc/types.js";
import { createWorker } from "../worker/index.js";
import type { FeatureApi, HostApi } from "./api.js";
import { createCommandBody } from "./client/command-body.js";
import { createCommandContext } from "./client/command-context.js";
import { parseCommand } from "./client/parse-command.js";
import type {
	CommandBody,
	CommandContext,
	Config,
	FeatureBuilder,
	FeatureId,
	FeatureInstance,
	Logger,
	SetupContext,
} from "./types.js";

type FeatureDefinition = FeatureId & {
	build: (ctx: SetupContext) => {
		summary: string | null;
		usage: string | null;
		matcher: RegExp;
		onCommand: (ctx: CommandContext, command: CommandBody) => Promise<void>;
	};
};

type WorkerData = {
	config: Config;
};

export const defineFeature = (
	definition: FeatureDefinition,
): FeatureBuilder => {
	const build = async (
		config: Config,
		logger: Logger,
		client: Client,
		unregister: () => void,
	): Promise<FeatureInstance> => {
		// entrypoint for host side

		const { transport, terminate } = await createWorker(
			import.meta.url,
			"default",
			{},
			(e) => {
				logger.error(`feature ${definition.name} has crashed.\n${e}`);
			},
		);

		createRpcServer<HostApi>(transport, {
			replyMessage: async (channelId, messageId, content) => {
				const channel = client.channels.resolve(channelId);
				if (channel === null || channel.isTextBased() === false) {
					logger.error(`feature ${definition.name} made invalid request.`);
					await terminate();
					unregister();
					return;
				}

				const message = channel.messages.resolve(messageId);
				if (message === null) {
					logger.error(`feature ${definition.name} made invalid request.`);
					await terminate();
					unregister();
					return;
				}

				await message.reply(content);
			},
			postChannel: async (channelId, content) => {
				const channel = client.channels.resolve(channelId);
				if (channel === null || channel.isTextBased() === false) {
					logger.error(`feature ${definition.name} made invalid request.`);
					await terminate();
					unregister();
					return;
				}

				await channel.send(content);
			},
		});

		const rpc = createRpcClient<FeatureApi>(transport);

		return {
			id: definition.id,
			name: definition.name,
			describe: () => rpc.call("describe"),
			onMessage: (message) =>
				rpc.call("onMessage", {
					messageId: message.id,
					channelId: message.channelId,
					author: {
						id: message.author.id,
						username: message.author.username,
					},
					content: message.content,
				}),
		};
	};

	const main = (transport: RpcTransport, data: WorkerData) => {
		// entrypoint for worker side

		const { config } = data;
		const host = createRpcClient<HostApi>(transport);
		const feature = definition.build({ config });

		createRpcServer<FeatureApi>(transport, {
			onMessage: async (message) => {
				const argv = parseCommand(message.content);
				if (argv.length === 0) {
					return;
				}

				const ctx = createCommandContext(message);
				const body = createCommandBody(feature.matcher, message.content, argv);

				if (ctx === null || body === null) {
					return;
				}

				feature.onCommand(ctx, body);
			},
			describe: async () => ({
				summary: feature.summary,
				usage: feature.usage,
			}),
		});
	};

	main.id = definition.id;
	main.name = definition.name;
	main.build = build;

	return main;
};
