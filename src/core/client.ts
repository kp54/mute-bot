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

  const reply = async (text: string) => {
    await message.reply(text);
  };

  const post = async (text: string) => {
    await message.channel.send(text);
  };

  const threadify = async (name: string) => {
    if (message.channel.isThread()) {
      return {
        channelId: message.channel.id,
        author,
        reply,
        post,
        threadify,
      };
    }

    const thread = await message.startThread({ name });
    const replyThread = async (_text: string) => {
      throw new Error('the beginning of the thread cannot be replied.');
    };
    const postThread = async (text: string) => {
      await thread.send(text);
    };

    return {
      channelId: thread.id,
      author,
      reply: replyThread,
      post: postThread,
      threadify,
    };
  };

  return {
    channelId: message.channel.id,
    author,
    reply,
    post,
    threadify,
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
