import { Client } from 'discord.js';

export interface RootAction {
  description: string;
  arguments: string[];
}

export interface GroupAction {
  name: string;
  description: string;
  arguments: string[];
}

export interface Group {
  name: string;
  description: string;
  actions: GroupAction[];
}

export interface Context {
  client: Client;
}

export abstract class Feature {
  /* eslint-disable-next-line
    no-unused-vars,
    no-useless-constructor,
    no-empty-function,
    @typescript-eslint/no-unused-vars,
    @typescript-eslint/no-empty-function,
  */
  constructor(ctx: Context) {}

  actions: (RootAction | Group)[] = [];
}
