import { Client, Intents } from 'discord.js';
import config from './config.js';
import { createCommandContext } from './core/client.js';
import echo from './features/echo/index.js';
import ping from './features/ping/index.js';
import pokemon from './features/pokemon/index.js';

(() => {
  const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.MESSAGE_CONTENT,
    ],
  });

  const features = [
    ping,
    echo,
    pokemon,
  ];

  client.on('ready', () => {
    // eslint-disable-next-line no-console
    console.log(`Logged in as ${client.user?.tag}!`);
  });

  client.on('messageCreate', (message) => {
    if (message.author.id === client.user?.id) {
      return;
    }

    if (!message.content.startsWith(config.prefix)) {
      return;
    }

    const content = message.content.slice(config.prefix.length).trim();
    const ctx = createCommandContext(message);
    const [head, ...rest] = content.split(/\s/); // TODO: parse quotes

    features.forEach((feat) => {
      const match = head.match(feat.matcher);

      if (match !== null) {
        feat.onCommand(ctx, match, rest);
      }
    });
  });

  client.login(config.discordToken);
})();
