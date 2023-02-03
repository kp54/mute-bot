import { ChannelType, Message } from 'discord.js';
import {
  ChannelCommandContext,
  CommandContext,
  ThreadCommandContext,
} from '../types.js';

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

export const createCommandContext = (
  message: Message
): CommandContext | null => {
  if (message.channel.type === ChannelType.GuildText) {
    return createChannelCommandContext(message);
  }

  if (message.channel.type === ChannelType.PublicThread) {
    return createThreadCommandContext(message);
  }

  return null;
};

export default {
  createCommandContext,
};
