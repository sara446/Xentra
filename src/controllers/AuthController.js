import { ENV } from '../config/env';
import { api } from '../services/api';
import { db } from '../data/mockDb';
import { createUser } from '../models/User';
import { isEmail } from '../utils/format';

let session = null;

const AuthController = {
  getCurrentUser: () => session,

  async login(email, password) {
    if (!email?.trim() || !password) throw new Error('Ingresa tu correo y contraseña.');
    if (!ENV.USE_MOCK) {
      const { user } = await api.post('/auth/login', { email, password });
      session = user;
      return user;
    }
    const user = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
    if (!user) throw new Error('Credenciales incorrectas.');
    if (!user.active) throw new Error('Tu usuario está inactivo.');
    session = user;
    return user;
  },

  async register({ name, email, password, confirm, role }) {
    if (!name?.trim()) throw new Error('Ingresa tu nombre completo.');
    if (!isEmail(email)) throw new Error('Ingresa un correo válido.');
    if (!password || password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.');
    if (password !== confirm) throw new Error('Las contraseñas no coinciden.');
    if (!ENV.USE_MOCK) return api.post('/auth/register', { name, email, password, role });
    if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) throw new Error('Ese correo ya está registrado.');
    const user = createUser({ name, email, password, role });
    db.users.push(user);
    return user;
  },

  async recoverPassword(email) {
    if (!isEmail(email)) throw new Error('Ingresa un correo válido.');
    if (!ENV.USE_MOCK) return api.post('/auth/forgot-password', { email });
    return true;
  },

  logout() {
    session = null;
  },
};

export default AuthController;
