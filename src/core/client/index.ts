import { Client, Events, GatewayIntentBits } from 'discord.js';
import { CommandBody, CreateClientOptions } from '../types.js';
import { createCommandContext } from './command-context.js';
import { parseCommand } from './parse-command.js';
import { createSetupContext } from './setup-context.js';

export const createClient = (options: CreateClientOptions) => {
  const client = new Client({
    intents:
      // eslint-disable-next-line no-bitwise
      GatewayIntentBits.Guilds |
      GatewayIntentBits.GuildMessages |
      GatewayIntentBits.MessageContent,
  });

  const setupCtx = createSetupContext(client, options);
  const features = (options.features ?? []).map((feat) => feat(setupCtx));

  client.on(Events.ClientReady, async () => {
    // eslint-disable-next-line no-console
    const { log } = console;

    const guilds = await client.guilds.fetch();

    log(`Logged in as ${client.user?.tag}`);

    log('serving for:');
    guilds.forEach((x) => log(`- [${x.id}]: ${x.name}`));
  });

  client.on(Events.MessageCreate, async (message) => {
    if (message.author.id === client.user?.id) {
      return;
    }

    const ctx = createCommandContext(message);
    if (ctx === null) {
      return;
    }

    const line = message.content.trim();
    const argv = parseCommand(line);

    if (argv.length === 0) {
      return;
    }

    const [head, ...rest] = argv;

    await Promise.all(
      features.map((feat) => {
        const match = head.match(feat.matcher);

        if (match === null) {
          return null;
        }

        const content = line.slice(match[0].length).trim();

        const command: CommandBody = {
          match,
          args: rest,
          content,
          line,
        };

        return feat.onCommand(ctx, command);
      })
    );
  });

  const run = async () => {
    await client.login(options.config.core.discordToken);
  };

  return {
    run,
  };
};

export default {
  createClient,
};
