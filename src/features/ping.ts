import { Feature, Context } from '../feature';

export default class Ping extends Feature {
  constructor(ctx: Context) {
    super(ctx);
    this.ctx = ctx;
  }

  private ctx: Context;

  actions = [
    {
      description: 'Replies with Pong!',
      arguments: [],
    },
  ];
}
