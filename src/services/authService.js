// src/services/authService.js
// Sesión con Firebase Authentication + perfil (nombre, rol) desde el backend en Ktor.
import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { api } from './api';

/**
 * Registro público (pantalla "Regístrate").
 * El backend crea la cuenta; el primer usuario del sistema queda como Administrador
 * y los siguientes como Empleado.
 */
export function register({ name, email, password }) {
  return api.public.post('/auth/register', { name, email: email.trim(), password });
}

/** Inicia sesión y devuelve el perfil del usuario (nombre, correo, rol). */
export async function login(email, password) {
  await signInWithEmailAndPassword(auth, email.trim(), password);
  try {
    return await getProfile();
  } catch (e) {
    // Usuario inactivo o backend apagado: no se deja la sesión a medias
    await signOut(auth);
    throw e;
  }
}

/** Cierra la sesión. */
export function logout() {
  return signOut(auth);
}

/** Envía un correo para restablecer la contraseña. */
export function resetPassword(email) {
  return sendPasswordResetEmail(auth, email.trim());
}

/** Perfil del usuario logueado (GET /api/me). */
export function getProfile() {
  return api.get('/me');
}

/** Escucha si hay sesión activa. Devuelve la función para dejar de escuchar. */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

/** Traduce los errores (Firebase o backend) a mensajes en español. */
export function getAuthErrorMessage(error) {
  const messages = {
    'auth/invalid-email': 'El correo no es válido.',
    'auth/missing-password': 'Escribe tu contraseña.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/email-already-in-use': 'Ya existe una cuenta con este correo.',
    'auth/invalid-credential': 'Correo o contraseña incorrectos.',
    'auth/user-not-found': 'No existe una cuenta con este correo.',
    'auth/wrong-password': 'Correo o contraseña incorrectos.',
    'auth/user-disabled': 'Tu usuario está inactivo. Contacta al administrador.',
    'auth/too-many-requests': 'Demasiados intentos. Espera un momento e inténtalo de nuevo.',
    'auth/network-request-failed': 'Sin conexión a internet.',
  };
  if (error?.code && messages[error.code]) return messages[error.code];
  // Errores del backend ya vienen en español
  if (error?.message && !String(error.message).startsWith('Firebase')) return error.message;
  return 'Ocurrió un error. Inténtalo de nuevo.';
}
