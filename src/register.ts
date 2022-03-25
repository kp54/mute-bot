import { REST } from '@discordjs/rest';
import { APIGuild, Routes } from 'discord-api-types/v9';
import config from './config';

(async () => {
  const commands = [{
    name: 'ping',
    description: 'Replies with Pong!',
  }];

  const rest = new REST({ version: '9' }).setToken(config.discordToken);

  const guilds: APIGuild[] = await (async () => {
    try {
      return await rest.get(
        Routes.userGuilds(),
      ) as APIGuild[];
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      return [];
    }
  })();

  await Promise.all(
    guilds
      .map(async (x) => {
        try {
          await rest.put(
            Routes.applicationGuildCommands(config.clientId, x.id),
            { body: commands },
          );
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
      }),
  );
})();
