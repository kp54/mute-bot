import { defineFeature } from '../../core/feature.js';

const pingPong = new Map([
  ['ping', 'pong!'], // ping-pong
  ['pong', 'ping!'], // vice versa
  ['hong', 'kong!'], // 香港
  ['kang', 'pang!'], // it's me, @kp54
]);

const keys = Array.from(pingPong)
  .map(([key, _value]) => key)
  .join('|');

export default defineFeature(({ config }) => ({
  matcher: new RegExp(`^${config.core.prefix}(${keys})$`),

  onCommand: async (ctx, match) => {
    if (ctx.type !== 'CHANNEL') {
      return;
    }

    const ping = match[0].slice(config.core.prefix.length);
    const pong = pingPong.get(ping);
    if (pong === undefined) {
      return;
    }

    await ctx.reply(pong);
  },
}));
