import { Client } from 'discord.js';
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

    await channel.send(message);
  };

  const requestMemory = <T>(id: string) => {
    const storage = connectStorage();

    const methods: Memory<T> = {
      get: async (key) => {
        const memory = await storage.get(id);
        return memory[key];
      },
      set: async (key, value) => {
        const memory = await storage.get(id);
        memory[key] = value;
        await storage.set(id, memory);
      },
      delete: async (key) => {
        const memory = await storage.get(id);
        delete memory[key];
        await storage.set(id, memory);
      },
      entries: async () => {
        const memory = await storage.get(id);
        return Object.entries(memory).filter(
          (item): item is [string, T] => item !== undefined
        );
      },
    };

    return methods;
  };

  return {
    prefix: options.prefix,
    post,
    requestMemory,
  };
};

export default { createSetupContext };
