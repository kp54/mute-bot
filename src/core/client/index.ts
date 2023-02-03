import { Client, Events, GatewayIntentBits } from 'discord.js';
import { FeatureFactory } from '../types.js';
import { createCommandContext } from './command-context.js';
import { parseCommand } from './parse-command.js';

type CreateClientOptions = {
  discordToken: string;
  prefix: string;
  features?: FeatureFactory[];
};

export const createClient = (options: CreateClientOptions) => {
  const client = new Client({
    intents:
      // eslint-disable-next-line no-bitwise
      GatewayIntentBits.Guilds |
      GatewayIntentBits.GuildMessages |
      GatewayIntentBits.MessageContent,
  });

  const features = (options.features ?? []).map((feat) =>
    feat({ prefix: options.prefix })
  );

  client.on(Events.ClientReady, () => {
    // eslint-disable-next-line no-console
    console.log(`Logged in as ${client.user?.tag}!`);
  });

  client.on(Events.MessageCreate, async (message) => {
    if (message.author.id === client.user?.id) {
      return;
    }

    const ctx = createCommandContext(message);
    if (ctx === null) {
      return;
    }

    const content = message.content.trim();
    const argv = parseCommand(content);

    if (argv === null) {
      await message.reply('パースエラー');
      return;
    }

    const [head, ...rest] = argv;

    await Promise.all(
      features.map((feat) => {
        const match = head.match(feat.matcher);

        if (match === null) {
          return null;
        }

        return feat.onCommand(ctx, match, rest);
      })
    );
  });

  const run = async () => {
    await client.login(options.discordToken);
  };

  return {
    run,
  };
};

export default {
  createClient,
};
