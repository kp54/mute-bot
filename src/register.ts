import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';


(() => {
  const commands = [{
    name: 'ping',
    description: 'Replies with Pong!'
  }];

  const rest = new REST({ version: '9' }).setToken(process.env['DISCORD_TOKEN'] ?? '');

  (async () => {
    try {
      await rest.put(
        Routes.applicationGuildCommands(process.env['CLIENT_ID'] ?? '', process.env['GUILD_ID'] ?? ''),
        { body: commands },
      );
    } catch (error) {
      console.error(error);
    }
  })();
})();
