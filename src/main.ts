import config from './config.local.js';
import { createClient } from './core/client/index.js';
import echo from './features/echo/index.js';
import hitAndBlow from './features/hit-and-blow/index.js';
import ping from './features/ping/index.js';
import pokemon from './features/pokemon/index.js';
import remind from './features/remind/index.js';
import rpn from './features/rpn/index.js';

const client = createClient({
  config,
  features: [ping, echo, pokemon, hitAndBlow, remind, rpn],
});

await client.run();
