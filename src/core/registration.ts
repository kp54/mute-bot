import { REST } from '@discordjs/rest';
import { APIApplicationCommand, APIGuild, Routes } from 'discord-api-types/v9';
import { FeatureDefinition, SetupContext } from './feature';
import { Config } from '../config';

type Command = {
  name: string;
  description: string;
}

const listGuildIds = (rest: REST) => (rest.get(Routes.userGuilds()) as Promise<APIGuild[]>)
  .then((guilds) => guilds.map(({ id }) => id))
  .catch(() => [] as string[]);

const listGuildCommandIds = (config: Config, rest: REST, guildId: string) => (rest.get(
  Routes.applicationGuildCommands(config.clientId, guildId),
) as Promise<APIApplicationCommand[]>)
  .then((x) => x.map(({ id: commandId }) => commandId))
  .catch(() => [] as string[]);

const registerCommandsForGuild = (
  config: Config,
  rest: REST,
  commands: Command[],
  id: string,
): Promise<void> => rest.put(
  Routes.applicationGuildCommands(config.clientId, id),
  { body: commands },
) as Promise<void>;

export const registrar = (config: Config) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const features: any[] = [];

  const commands: Command[] = [];

  const setupContext: SetupContext = {
    registerCommand(name, description, params?) {
      commands.push({ name, description });
    },
  };

  return {
    addFeature<T>(feature: FeatureDefinition<T>) {
      const feat = feature.setup(setupContext);
      features.push(feat);
    },

    async register() {
      const rest = new REST({ version: '9' }).setToken(config.discordToken);
      const guildIds = await listGuildIds(rest);

      await Promise.all(
        guildIds
          .map((id) => registerCommandsForGuild(config, rest, commands, id)),
      );

      return features;
    },

    async unregister() {
      const rest = new REST({ version: '9' }).setToken(config.discordToken);
      const guildIds = await listGuildIds(rest);

      const guildCommandIds = (await Promise.all(
        guildIds.map(async (guildId) => ({
          guildId,
          commandIds: await listGuildCommandIds(config, rest, guildId),
        })),
      ))
        .flatMap(
          ({ guildId, commandIds }) => commandIds
            .map((commandId) => [guildId, commandId] as const),
        );

      await Promise.all(
        guildCommandIds
          .map(([guildId, commandId]) => rest.delete(
            Routes.applicationGuildCommand(config.clientId, guildId, commandId),
          )),
      );
    },
  };
};

export default { registrar };
