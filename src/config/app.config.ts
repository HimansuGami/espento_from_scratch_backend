export const API_CONFIG = () => {
  return {
    USER_NAME: process.env['USER_NAME'],
    PASSWORD: process.env['PASSWORD'],
    PARENT_EMAIL: {
      isProd: process.env['isProd'],
      EMAIL: process.env['EMAIL'],
    },
    isProd: process.env['isProd'] === 'true',
  };
};
