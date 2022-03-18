import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });


export default (() => {
  const required = (key: string): string => {
    const value = process.env[key];

    if (value === undefined) {
      throw new Error(`missing environment variable ${key}`);
    }

    return value;
  };

  const optional = (key: string, default_: string|null = null): string | null => {
    return process.env[key] ?? default_;
  };

  return {
    discordToken: required('DISCORD_TOKEN'),
    clientId: required('CLIENT_ID'),
    guildId: required('GUILD_ID'),
  };
})()
