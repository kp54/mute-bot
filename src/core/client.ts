import { Message } from 'discord.js';
import { CommandContext } from './feature.js';

export const createCommandContext = (message: Message): CommandContext => {
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

export default {
  createCommandContext,
};
