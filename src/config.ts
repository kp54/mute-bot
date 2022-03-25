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

  return {
    discordToken: required('DISCORD_TOKEN'),
    clientId: required('CLIENT_ID'),
  };
})();
