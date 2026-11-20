import { Alert } from 'react-native';

// Evita mostrar el mismo aviso varias veces seguidas (varias pantallas cargando a la vez).
let lastShown = 0;

/** Muestra un aviso cuando falla la carga de datos desde el backend. */
export function showLoadError(err) {
  const now = Date.now();
  if (now - lastShown < 3000) return;
  lastShown = now;
  Alert.alert('No se pudieron cargar los datos', err?.message || 'Inténtalo de nuevo.');
}
