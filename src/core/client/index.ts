import { Client, Events, GatewayIntentBits } from 'discord.js';
import { CreateClientOptions, Feature } from '../types.js';
import { handleHelp } from './builtins/help.js';
import { createCommandBody } from './command-body.js';
import { createCommandContext } from './command-context.js';
import { parseCommand } from './parse-command.js';
import { createSetupContext } from './setup-context.js';

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

    logger?.log('serving for:');
    guilds.forEach((x) => logger?.log(`- [${x.id}]: ${x.name}`));

    guilds.forEach((guild) => {
      const setupCtx = createSetupContext(guild.id, client, options);
      guildFeatures.set(
        guild.id,
        (featureBuilders ?? []).map((feat) => feat(setupCtx)),
      );
    });
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
      features.map((feat) => {
        const body = createCommandBody(feat.matcher, line, argv);
        if (body === null) {
          return null;
        }

        return feat.onCommand(ctx, body);
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
