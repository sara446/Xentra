import { api } from '../services/api';
import { MOVEMENT_TYPES } from '../models/Movement';

const MovementController = {
  async getAll(type = 'Todos') {
    let list = await api.get('/movements');
    if (type === 'Entradas') list = list.filter((m) => m.type === MOVEMENT_TYPES.IN);
    if (type === 'Salidas') list = list.filter((m) => m.type === MOVEMENT_TYPES.OUT);
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  /** El backend valida el stock y lo actualiza en la misma operación. */
  async create({ productId, type, quantity, note }) {
    const qty = Number(quantity);
    if (!productId) throw new Error('Selecciona un producto.');
    if (!qty || qty <= 0) throw new Error('Ingresa una cantidad válida.');
    return api.post('/movements', { productId, type, quantity: qty, note: note ?? '' });
  },
};

export default MovementController;
