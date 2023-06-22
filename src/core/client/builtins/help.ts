import { Client, Events } from 'discord.js';
import { CreateClientOptions, Feature } from '../../types.js';
import { parseCommand } from '../parse-command.js';

export default (
  options: CreateClientOptions,
  client: Client,
  features: Feature[]
) => {
  const { prefix } = options.config.core;

  client.on(Events.MessageCreate, async (message) => {
    if (message.author.id === client.user?.id) {
      return;
    }

    const usage = async () => {
      const lines = [
        '```',
        ...features.map((x) => `${x.name} : ${x.summary}`),
        '```',
      ].join('\n');

      await message.reply(lines);
    };

    const line = message.content.trim();
    const argv = parseCommand(line);

    if (argv[0] !== `${prefix}help`) {
      return;
    }

    if (argv.length === 1) {
      await usage();
      return;
    }

    const name = argv[1];
    const feat = features.find((x) => x.name === name);
    if (feat === undefined) {
      await usage();
      return;
    }

    if (feat.usage === null) {
      await message.reply('ヘルプは利用できません');
      return;
    }

    await message.reply(feat.usage);
  });
};
