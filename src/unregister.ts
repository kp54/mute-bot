import { REST } from '@discordjs/rest';
import { Routes, APIApplicationCommand, APIGuild } from 'discord-api-types/v9';
import config from './config';

(async () => {
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

  const guildCommands = await Promise.all(
    guilds
      .map(async (guild): Promise<[APIGuild, APIApplicationCommand[]]> => {
        try {
          return [
            guild,
        await rest.get(
          Routes.applicationGuildCommands(config.clientId, guild.id),
        ) as APIApplicationCommand[],
          ];
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
          return [guild, []];
        }
      }),
  );

  await Promise.all(
    guildCommands
      .flatMap(([guild, commands]) => commands
        .map((y): [APIGuild, APIApplicationCommand] => [guild, y]))
      .map(async ([guild, command]) => {
        try {
          await rest.delete(
            Routes.applicationGuildCommand(config.clientId, guild.id, command.id),
          );
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
      }),
  );
})();
