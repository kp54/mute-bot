import { Client, Events, GatewayIntentBits } from "discord.js";
import type { CreateClientOptions, Feature } from "../types.js";
import { handleHelp } from "./builtins/help.js";
import { createCommandBody } from "./command-body.js";
import { createCommandContext } from "./command-context.js";
import { parseCommand } from "./parse-command.js";
import { createSetupContext } from "./setup-context.js";

const formatError = (e: Error): string => {
	const lines = [`${e.name}: ${e.message}`, e.stack];

	if (e.cause instanceof Error) {
		lines.push(formatError(e.cause));
	}

	return lines.join("\n");
};

export const createClient = (options: CreateClientOptions) => {
	const { config, features: featureBuilders, logger } = options;

	const client = new Client({
		intents:
			// eslint-disable-next-line no-bitwise
			GatewayIntentBits.Guilds |
			GatewayIntentBits.GuildMessages |
			GatewayIntentBits.MessageContent,
	});

	const guildFeatures = new Map<string, Feature[]>();

	client.on(Events.ClientReady, async () => {
		const guilds = await client.guilds.fetch();

		logger?.log(`Logged in as ${client.user?.tag}`);

		logger?.log("serving for:");
		for (const [, guild] of guilds) {
			logger?.log(`- [${guild.id}]: ${guild.name}`);
		}

		for (const [, guild] of guilds) {
			const setupCtx = createSetupContext(guild.id, client, options);
			guildFeatures.set(
				guild.id,
				(featureBuilders ?? []).map((feat) => feat(setupCtx)),
			);
		}
	});

	client.on(Events.MessageCreate, async (message) => {
		if (message.author.id === client.user?.id) {
			return;
		}

		if (message.guildId === null) {
			return;
		}

		const features = guildFeatures.get(message.guildId) ?? [];

		const ctx = createCommandContext(message);
		if (ctx === null) {
			return;
		}

		const line = message.content.trim();
		const argv = parseCommand(line);

		if (argv.length === 0) {
			return;
		}

		if (await handleHelp(config, features, argv, message)) {
			return;
		}

		await Promise.all(
			features.map(async (feat) => {
				const body = createCommandBody(feat.matcher, line, argv);
				if (body === null) {
					return;
				}

				try {
					await feat.onCommand(ctx, body);
				} catch (e) {
					const details = e instanceof Error ? formatError(e) : String(e);
					logger?.error(`feature \`${feat.name}\` crashed:`, details);
				}
			}),
		);
	});

	const run = async () => {
		await client.login(config.core.discordToken);
	};

	return {
		run,
	};
};

export default {
	createClient,
};
