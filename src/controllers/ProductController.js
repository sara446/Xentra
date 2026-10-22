import { ENV } from '../config/env';
import { api } from '../services/api';
import { db } from '../data/mockDb';
import { createProduct } from '../models/Product';

const validate = (p) => {
  if (!p.name?.trim()) throw new Error('Ingresa el nombre del producto.');
  if (!p.code?.trim()) throw new Error('Ingresa el código o referencia.');
  if (isNaN(Number(p.stock)) || Number(p.stock) < 0) throw new Error('La cantidad no es válida.');
  if (isNaN(Number(p.minStock)) || Number(p.minStock) < 0) throw new Error('El stock mínimo no es válido.');
};

const ProductController = {
  async getAll(query = '', filter = 'Todos') {
    let list = ENV.USE_MOCK ? [...db.products] : await api.get('/products');
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => {
        if (filter === 'Nombre') return p.name.toLowerCase().includes(q);
        if (filter === 'Código') return p.code.toLowerCase().includes(q);
        if (filter === 'Categoría') return p.category.toLowerCase().includes(q);
        return [p.name, p.code, p.category].some((v) => v.toLowerCase().includes(q));
      });
    }
    return list;
  },

  async getById(id) {
    if (!ENV.USE_MOCK) return api.get(`/products/${id}`);
    const p = db.products.find((x) => x.id === id);
    if (!p) throw new Error('Producto no encontrado.');
    return { ...p };
  },

  async create(data) {
    validate(data);
    if (!ENV.USE_MOCK) return api.post('/products', data);
    if (db.products.some((p) => p.code.toLowerCase() === data.code.trim().toLowerCase())) {
      throw new Error('Ya existe un producto con ese código.');
    }
    const product = createProduct(data);
    db.products.unshift(product);
    return product;
  },

  async update(id, data) {
    validate(data);
    if (!ENV.USE_MOCK) return api.put(`/products/${id}`, data);
    const i = db.products.findIndex((p) => p.id === id);
    db.products[i] = createProduct({ ...db.products[i], ...data, id });
    return db.products[i];
  },

  async remove(id) {
    if (!ENV.USE_MOCK) return api.delete(`/products/${id}`);
    db.products = db.products.filter((p) => p.id !== id);
  },
};

export default ProductController;
