import { ChannelType, Client } from 'discord.js';
import { connectStorage } from '../memory.js';
import { CreateClientOptions, Memory, SetupContext } from '../types.js';

export const createSetupContext = (
  client: Client,
  options: CreateClientOptions
): SetupContext => {
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

  const requestMemory = <T>(id: string): Memory<T> => ({
    get: async (key) => {
      const memory = await storage.get<T>(id);
      return memory[key];
    },
    set: async (key, value) => {
      const memory = await storage.get<T>(id);
      memory[key] = value;
      await storage.set(id, memory);
    },
    delete: async (key) => {
      const memory = await storage.get<T>(id);
      delete memory[key];
      await storage.set(id, memory);
    },
    entries: async () => {
      const memory = await storage.get<T>(id);
      return Object.entries(memory);
    },
  });

  return {
    config: options.config,
    post,
    requestMemory,
  };
};

export default { createSetupContext };
