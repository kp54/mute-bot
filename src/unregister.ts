import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { REST } from '@discordjs/rest';
import { Routes, APIApplicationCommand } from 'discord-api-types/v9';


(async () => {
  const rest = new REST({ version: '9' }).setToken(process.env['DISCORD_TOKEN'] ?? '');

  try {
    const resp = await rest.get(
      Routes.applicationGuildCommands(process.env['CLIENT_ID'] ?? '', process.env['GUILD_ID'] ?? '')
    ) as APIApplicationCommand[];

    for(const item of resp) {
      if (item.application_id !== process.env['CLIENT_ID'])
      {
        continue;
      }

      await rest.delete(
        Routes.applicationGuildCommand(process.env['CLIENT_ID'], process.env['GUILD_ID'] ?? '', item.id)
      );
    }
  } catch (error) {
    console.error(error);
  }
})();
