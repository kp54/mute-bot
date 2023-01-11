import { defineFeature } from '../core/feature';

export default defineFeature({
  name: 'ping',

  onCommand(ctx, command) {
    if (command.length !== 1 || command[0] !== 'ping') {
      return;
    }

    ctx.reply('pong!');
  },
});
