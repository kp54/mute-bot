import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export type Config = Readonly<{
  discordToken: string;
  prefix: string;
}>;

const required = (key: string): string => {
  const value = process.env[key];

  if (value === undefined) {
    throw new Error(`missing environment variable ${key}`);
  }

  return value;
};

const optional = (key: string): string | undefined => process.env[key];

const config: Config = {
  discordToken: required('DISCORD_TOKEN'),
  prefix: optional('COMMAND_PREFIX') ?? '/',
};

export default config;
