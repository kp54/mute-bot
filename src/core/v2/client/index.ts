import { Client, Events, GatewayIntentBits } from "discord.js";
import type { CreateClientOptions, FeatureInstance } from "../types.js";

export const createClient = (options: CreateClientOptions) => {
	const { config, features: FeatureBuilders, logger } = options;

	const client = new Client({
		intents:
			GatewayIntentBits.Guilds |
			GatewayIntentBits.GuildMessages |
			GatewayIntentBits.MessageContent,
	});

	const guildFeatures = new Map<string, FeatureInstance[]>();

	client.on(Events.ClientReady, async () => {
		const guilds = await client.guilds.fetch();

		logger.log(`Logged in as ${client.user?.tag}`);

		logger.log("serving for:");
		for (const [, guild] of guilds) {
			logger.log(`- [${guild.id}]: ${guild.name}`);
		}

		const features = new Array<FeatureInstance>();
		for (const builder of FeatureBuilders) {
			const feat = await builder.build(config, logger, client, () => {
				const index = features.findIndex((x) => x.id === feat.id);
				if (index !== -1) {
					features.splice(index, 1);
				}
			});
			features.push(feat);
		}
	});

	const run = async () => {
		await client.login(config.core.discordToken);
	};

	return {
		run,
	};
};
