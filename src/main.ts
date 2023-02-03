import config from './config.js';
import { createClient } from './core/client/index.js';
import echo from './features/echo/index.js';
import hitAndBlow from './features/hit-and-blow/index.js';
import ping from './features/ping/index.js';
import pokemon from './features/pokemon/index.js';
import remind from './features/remind/index.js';

const client = createClient({
  discordToken: config.discordToken,
  prefix: config.prefix,
  features: [ping, echo, pokemon, hitAndBlow, remind],
});

await client.run();
