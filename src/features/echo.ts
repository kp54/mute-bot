import { Context, Feature } from '../feature';

export default class Echo extends Feature {
  constructor(ctx: Context) {
    super(ctx);
    this.ctx = ctx;
  }

  private ctx: Context;

  actions = [
    {
      description: 'echo back text',
      arguments: ['text'],
    },
  ];
}
