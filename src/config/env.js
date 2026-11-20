// Lee las variables del archivo .env (prefijo EXPO_PUBLIC_)
export const ENV = {
  APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || 'Xentra',
  // URL del backend en Ktor, terminada en /api. Ej: http://192.168.1.15:8080/api
  API_URL: (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, ''),
};
