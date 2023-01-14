import { Message } from 'discord.js';
import { CommandContext } from './feature.js';

export const createCommandContext = (message: Message): CommandContext => {
  const reply = (text: string) => message.reply(text);
  const post = (text: string) => message.channel.send(text);

  return {
    reply,
    post,
  };
};

export default {};
