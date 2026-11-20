// Cliente HTTP para el backend en Ktor.
// Envía automáticamente el token de Firebase del usuario logueado.
import { ENV } from '../config/env';
import { auth } from '../config/firebase';

const TIMEOUT_MS = 15000;

/** Error de la API con el código HTTP y el campo del formulario (si aplica). */
export class ApiError extends Error {
  constructor(message, status, field) {
    super(message);
    this.status = status;
    this.field = field;
  }
}

async function getToken(forceRefresh = false) {
  const user = auth.currentUser;
  return user ? user.getIdToken(forceRefresh) : null;
}

async function request(method, path, body, { withAuth = true, retry = true } = {}) {
  if (!ENV.API_URL) {
    throw new ApiError('Falta EXPO_PUBLIC_API_URL en el archivo .env.', 0);
  }

  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
  if (withAuth) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res;
  try {
    res = await fetch(`${ENV.API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (e) {
    throw new ApiError(
      'No se pudo conectar con el servidor. Verifica que el backend esté encendido y que la IP del .env sea correcta.',
      0
    );
  } finally {
    clearTimeout(timer);
  }

  // Token vencido: se renueva una vez y se reintenta
  if (res.status === 401 && withAuth && retry && auth.currentUser) {
    await getToken(true);
    return request(method, path, body, { withAuth, retry: false });
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(err.message || `Error ${res.status}`, res.status, err.field);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  get: (p) => request('GET', p),
  post: (p, b) => request('POST', p, b),
  put: (p, b) => request('PUT', p, b),
  delete: (p) => request('DELETE', p),
  /** Peticiones sin sesión (ej. registro). */
  public: {
    post: (p, b) => request('POST', p, b, { withAuth: false }),
  },
};
