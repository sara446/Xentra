// Lee las variables del archivo .env (prefijo EXPO_PUBLIC_)
export const ENV = {
  APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || 'Xentra',
  API_URL: process.env.EXPO_PUBLIC_API_URL || '',
  USE_MOCK: process.env.EXPO_PUBLIC_USE_MOCK !== 'false',
};
