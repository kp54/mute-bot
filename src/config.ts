import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export type Config = Readonly<{
  discordToken: string;
}>;

const required = (key: string): string => {
  const value = process.env[key];

  if (value === undefined) {
    throw new Error(`missing environment variable ${key}`);
  }

  return value;
};

const config: Config = {
  discordToken: required('DISCORD_TOKEN'),
};

export default config;
