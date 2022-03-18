import { REST } from '@discordjs/rest';
import { Routes, APIApplicationCommand } from 'discord-api-types/v9';
import config from './config';


(async () => {
  const rest = new REST({ version: '9' }).setToken(config.discordToken);

  try {
    const resp = await rest.get(
      Routes.applicationGuildCommands(config.clientId, config.guildId)
    ) as APIApplicationCommand[];

    for(const item of resp) {
      if (item.application_id !== config.clientId)
      {
        continue;
      }

      await rest.delete(
        Routes.applicationGuildCommand(config.clientId, config.guildId, item.id)
      );
    }
  } catch (error) {
    console.error(error);
  }
})();
