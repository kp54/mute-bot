import { defineFeature } from '../core/feature';

export default defineFeature({
  name: 'ping',

  setup(ctx) {
    ctx.registerCommand('ping', 'Replies with `pong!`');
  },

  onCommand(_, ctx, command) {
    if (command.length !== 1 || command[0] !== 'ping') {
      return;
    }

    ctx.reply('pong!');
  },
});
