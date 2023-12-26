import { registerAs } from '@nestjs/config';

export const DATABASE_CONFIG = registerAs('DATABASE', () => {
  return {
    USER_NAME: process.env['USER_NAME'],
    PASSWORD: process.env['PASSWORD'],
    get url(): string {
      return `www.google.com`;
    },
    isLocal(): string {
      return 'Hello';
    },
  };
});
