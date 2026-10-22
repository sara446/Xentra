import { ENV } from '../config/env';
import { api } from '../services/api';
import { db } from '../data/mockDb';
import { createMovement, MOVEMENT_TYPES } from '../models/Movement';
import AuthController from './AuthController';

const MovementController = {
  async getAll(type = 'Todos') {
    let list = ENV.USE_MOCK ? [...db.movements] : await api.get('/movements');
    if (type === 'Entradas') list = list.filter((m) => m.type === MOVEMENT_TYPES.IN);
    if (type === 'Salidas') list = list.filter((m) => m.type === MOVEMENT_TYPES.OUT);
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async create({ productId, type, quantity, note }) {
    const qty = Number(quantity);
    if (!productId) throw new Error('Selecciona un producto.');
    if (!qty || qty <= 0) throw new Error('Ingresa una cantidad válida.');
    if (!ENV.USE_MOCK) return api.post('/movements', { productId, type, quantity: qty, note });

    const product = db.products.find((p) => p.id === productId);
    if (!product) throw new Error('El producto seleccionado no existe.');
    if (type === MOVEMENT_TYPES.OUT && qty > product.stock) {
      throw new Error(`Solo hay ${product.stock} unidades disponibles.`);
    }
    product.stock += type === MOVEMENT_TYPES.IN ? qty : -qty;
    const movement = createMovement({
      productId, productName: product.name, productCode: product.code,
      type, quantity: qty, note, user: AuthController.getCurrentUser()?.name,
    });
    db.movements.unshift(movement);
    return movement;
  },

  async countRecent(type) {
    const list = await this.getAll();
    return list.filter((m) => m.type === type).length;
  },
};

export default MovementController;
