import {
  ChannelType,
  Client,
  Events,
  GatewayIntentBits,
  Message,
} from 'discord.js';
import {
  ChannelCommandContext,
  CommandContext,
  FeatureFactory,
  ThreadCommandContext,
} from './types.js';

type CreateClientOptions = {
  discordToken: string;
  prefix: string;
  features?: FeatureFactory[];
};

const createThreadCommandContext = (message: Message): ThreadCommandContext => {
  const author = {
    id: message.author.id,
    username: message.author.username,
  };

  const post = async (text: string) => {
    await message.channel.send(text);
  };

  return {
    type: 'THREAD',
    threadId: message.channel.id,
    author,
    post,
  };
};

const createChannelCommandContext = (
  message: Message
): ChannelCommandContext => {
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

  const threadify = async (name: string): Promise<ThreadCommandContext> => {
    const thread = await message.startThread({ name });

    const postThread = async (text: string) => {
      await thread.send(text);
    };

    return {
      type: 'THREAD',
      threadId: thread.id,
      author,
      post: postThread,
    };
  };

  return {
    type: 'CHANNEL',
    channelId: message.channel.id,
    author,
    reply,
    post,
    threadify,
  };
};

const createCommandContext = (message: Message): CommandContext | null => {
  if (message.channel.type === ChannelType.GuildText) {
    return createChannelCommandContext(message);
  }

  if (message.channel.type === ChannelType.PublicThread) {
    return createThreadCommandContext(message);
  }

  return null;
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
