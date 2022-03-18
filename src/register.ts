import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import config from './config';

(() => {
  const commands = [{
    name: 'ping',
    description: 'Replies with Pong!',
  }];

  const rest = new REST({ version: '9' }).setToken(config.discordToken);

  (async () => {
    try {
      await rest.put(
        Routes.applicationGuildCommands(config.clientId, config.guildId),
        { body: commands },
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  })();
})();
