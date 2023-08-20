import { ChannelType, Client } from 'discord.js';
import { connectStorage } from '../memory.js';
import { Timers, createTimers } from '../timers.js';
import { CreateClientOptions, Memory, SetupContext } from '../types.js';
import { formatError } from './format-error.js';

export const createSetupContext = (
  guildId: string,
  client: Client,
  options: CreateClientOptions,
): SetupContext => {
  const { config, logger } = options;

  const post = async (channelId: string, message: string) => {
    const channel = client.channels.resolve(channelId);

    if (channel === null) {
      throw new Error(`${channelId}: no such channel.`);
    }

    if (!channel.isTextBased()) {
      throw new Error(`${channelId}: the channel is not text-based.`);
    }

    if (channel.type === ChannelType.GuildStageVoice) {
      throw new Error(`${channelId}: stage channels are not supported.`);
    }

    await channel.send(message);
  };

  const storage = connectStorage();

  const requestMemory = <T>(id: string): Memory<T> =>
    storage.getMemory(guildId, id);

  const requestTimers = (name: string): Timers =>
    createTimers((e) => {
      const details = e instanceof Error ? formatError(e) : String(e);
      logger?.error(`feature \`${name}\` crashed:`, details);
    });

  return {
    config,
    post,
    requestMemory,
    requestTimers,
  };
};
