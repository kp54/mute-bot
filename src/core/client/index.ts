import { Client, Events, GatewayIntentBits } from 'discord.js';
import { FeatureFactory } from '../types.js';
import { createCommandContext } from './command-context.js';

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

  client.on(Events.MessageCreate, (message) => {
    if (message.author.id === client.user?.id) {
      return;
    }

    const ctx = createCommandContext(message);
    if (ctx === null) {
      return;
    }

    const content = message.content.trim();
    const [head, ...rest] = content.split(/\s+/); // TODO: parse quotes

    features.forEach((feat) => {
      const match = head.match(feat.matcher);

      if (match !== null) {
        void feat.onCommand(ctx, match, rest);
      }
    });
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
