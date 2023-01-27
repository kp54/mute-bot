import config from './config.js';
import { createClient } from './core/client.js';
import echo from './features/echo/index.js';
import hitAndBlow from './features/hit-and-blow/index.js';
import ping from './features/ping/index.js';
import pokemon from './features/pokemon/index.js';

const client = createClient({
  discordToken: config.discordToken,
  prefix: config.prefix,
  features: [ping, echo, pokemon, hitAndBlow],
});

await client.run();
