import { registerAs } from '@nestjs/config';

export const JWT_CONFIG = registerAs('JWT', () => {
  return {
    // JWT_SECRET: 'khagsdkhasgdkashdahsd',
    // JWT_EXPIRE_IN: '365d',
    JWT_SECRET: process.env['JWT_SECRET'],
    JWT_EXPIRE_IN: process.env['JWT_EXPIRE_IN'],
  };
});
