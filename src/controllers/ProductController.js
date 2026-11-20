import { api } from '../services/api';

const validate = (p) => {
  if (!p.name?.trim()) throw new Error('Ingresa el nombre del producto.');
  if (!p.code?.trim()) throw new Error('Ingresa el código o referencia.');
  if (isNaN(Number(p.stock)) || Number(p.stock) < 0) throw new Error('La cantidad no es válida.');
  if (isNaN(Number(p.minStock)) || Number(p.minStock) < 0) throw new Error('El stock mínimo no es válido.');
};

// Solo se envían los campos que guarda el backend
const toBody = (p) => ({
  name: p.name?.trim(),
  code: p.code?.trim(),
  category: p.category,
  stock: Number(p.stock),
  minStock: Number(p.minStock),
  location: p.location?.trim() ?? '',
  image: p.image ?? null,
});

const ProductController = {
  async getAll(query = '', filter = 'Todos') {
    let list = await api.get('/products');
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

  getById(id) {
    return api.get(`/products/${id}`);
  },

  async create(data) {
    validate(data);
    return api.post('/products', toBody(data));
  },

  async update(id, data) {
    validate(data);
    return api.put(`/products/${id}`, toBody(data));
  },

  remove(id) {
    return api.delete(`/products/${id}`);
  },
};

export default ProductController;
