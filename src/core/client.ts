import { Client, Intents, Message } from 'discord.js';
import { CommandContext, FeatureFactory } from './types.js';

type CreateClientOptions = {
  discordToken: string;
  prefix: string;
  features?: FeatureFactory[];
};

const createCommandContext = (message: Message): CommandContext => {
  const author = {
    id: message.author.id,
    username: message.author.username,
  };

  const reply = (text: string) => message.reply(text);
  const post = (text: string) => message.channel.send(text);

  return {
    author,
    reply,
    post,
  };
};

export const createClient = (options: CreateClientOptions) => {
  const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.MESSAGE_CONTENT,
    ],
  });

  const features = (options.features ?? []).map((feat) =>
    feat({ prefix: options.prefix })
  );

  client.on('ready', () => {
    // eslint-disable-next-line no-console
    console.log(`Logged in as ${client.user?.tag}!`);
  });

  client.on('messageCreate', (message) => {
    if (message.author.id === client.user?.id) {
      return;
    }

    const content = message.content.trim();
    const ctx = createCommandContext(message);
    const [head, ...rest] = content.split(/\s+/); // TODO: parse quotes

    features.forEach((feat) => {
      const match = head.match(feat.matcher);

      if (match !== null) {
        feat.onCommand(ctx, match, rest);
      }
    });
  });

  const run = () => client.login(options.discordToken);

  return {
    run,
  };
};

export default {
  createClient,
};
