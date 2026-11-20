// Configuración de Metro (empaquetador de Expo).
// El backend en Kotlin vive en este mismo proyecto: se le indica a Metro
// que ignore los archivos de Gradle/Kotlin para que no los vigile.
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Convierte una ruta en expresión regular (sirve en Windows y Mac)
const escape = (p) =>
  p
    .split(/[/\\]/)
    .map((part) => part.replace(/[.*+?^${}()|[\]]/g, '\\$&'))
    .join('[/\\\\]');
const ignore = ['build', '.gradle', '.kotlin', 'gradle', path.join('src', 'main')].map(
  (dir) => new RegExp(`^${escape(path.join(__dirname, dir))}[/\\\\].*`)
);

config.resolver.blockList = [
  ...(Array.isArray(config.resolver.blockList)
    ? config.resolver.blockList
    : config.resolver.blockList
      ? [config.resolver.blockList]
      : []),
  ...ignore,
];

module.exports = config;
