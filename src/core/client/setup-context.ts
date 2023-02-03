import { Client } from 'discord.js';
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const memories = new Map<string, Memory<any>>();

  const requestMemory = <T>(id: string) => {
    const mem: Memory<T> | undefined = memories.get(id);
    if (mem !== undefined) {
      return mem;
    }

    const container: Record<string, T | undefined> = Object.create(null);

    const handlers: Memory<T> = {
      get: (key) => container[key],
      set: (key, value) => {
        container[key] = value;
      },
      delete: (key) => {
        delete container[key];
      },
      entries: () =>
        Object.entries(container).filter(
          (item): item is [string, T] => item !== undefined
        ),
    };

    return handlers;
  };

  return {
    prefix: options.prefix,
    post,
    requestMemory,
  };
};

export default { createSetupContext };
