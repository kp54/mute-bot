import { Client, Intents } from 'discord.js';
import config from './config';
import { createCommandContext } from './core/client';
import features from './features';

(() => {
  const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

  client.on('ready', () => {
    // eslint-disable-next-line no-console
    console.log(`Logged in as ${client.user?.tag}!`);
  });

  client.on('messageCreate', async (message) => {
    const ctx = createCommandContext(message);
    features.forEach((feat) => {
      feat.onCommand(ctx, [message.content]);
    });
  });

  client.login(config.discordToken);
})();
