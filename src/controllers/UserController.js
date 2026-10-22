import { ENV } from '../config/env';
import { api } from '../services/api';
import { db } from '../data/mockDb';

const UserController = {
  async getAll(query = '') {
    const list = ENV.USE_MOCK ? [...db.users] : await api.get('/users');
    const q = query.trim().toLowerCase();
    return q ? list.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) : list;
  },

  async toggleActive(id) {
    if (!ENV.USE_MOCK) return api.put(`/users/${id}/toggle`);
    const u = db.users.find((x) => x.id === id);
    u.active = !u.active;
    return u;
  },
};

export default UserController;
