import { api } from '../services/api';

const UserController = {
  async getAll(query = '') {
    const list = await api.get('/users');
    const q = query.trim().toLowerCase();
    return q ? list.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) : list;
  },

  /** Crear usuario desde Gestión de usuarios (solo administradores). */
  async create({ name, email, password, role }) {
    return api.post('/users', { name, email: email.trim(), password, role });
  },

  toggleActive(id) {
    return api.put(`/users/${id}/toggle`);
  },
};

export default UserController;
