import { REST } from '@discordjs/rest';
import { Routes, APIApplicationCommand } from 'discord-api-types/v9';
import config from './config';

(async () => {
  const rest = new REST({ version: '9' }).setToken(config.discordToken);

  const resp = await (async () => {
    try {
      return await rest.get(
        Routes.applicationGuildCommands(config.clientId, config.guildId),
      ) as APIApplicationCommand[];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return [];
    }
  })();

  await resp
    .filter((x) => x.application_id === config.clientId)
    .map((x) => async () => {
      try {
        await rest.delete(
          Routes.applicationGuildCommand(config.clientId, config.guildId, x.id),
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    })
    .reduce((acc, x) => acc.then(x), Promise.resolve());
})();
