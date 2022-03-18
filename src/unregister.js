const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const { REST } = require('@discordjs/rest');
const { Routes, APIApplicationCommand } = require('discord-api-types/v9');

const rest = new REST({ version: '9' }).setToken(process.env['DISCORD_TOKEN']);

(async () => {
  try {

    /**
     * @type {APIApplicationCommand[]}
     */
    const resp = await rest.get(
      Routes.applicationGuildCommands(process.env['CLIENT_ID'], process.env['GUILD_ID'])
    );

    for(const item of resp) {
      if (item.application_id !== process.env['CLIENT_ID'])
      {
        continue;
      }

      await rest.delete(
        Routes.applicationGuildCommand(process.env['CLIENT_ID'], process.env['GUILD_ID'], item.id)
      );
    }
  } catch (error) {
    console.error(error);
  }
})();
