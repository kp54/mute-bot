import { defineFeature } from '../core/feature';

export default defineFeature({
  name: 'echo',

  setup(ctx) {
    ctx.registerCommand('echo', 'echo back arguments', ['text']);
  },

  onCommand(_, ctx, command) {
    if (command.length < 2 || command[0] !== 'echo') {
      return;
    }

    ctx.reply(command.slice(1).join(' '));
  },
});
