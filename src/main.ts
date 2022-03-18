import { Client, Intents } from 'discord.js';
import config from './config';


(() => {
  const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

  client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
  });

  client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'ping') {
      await interaction.reply('Pong!');
    }
  });

  client.on('messageCreate', async message => {
    if (message.content !== 'ping') {
      return;
    }

    await message.reply('pong!');
  })

  client.login(config.discordToken);
})();
