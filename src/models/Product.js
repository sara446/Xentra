export const CATEGORIES = ['Tecnología', 'Accesorios de Oficina', 'Accesorios', 'Mobiliario', 'Papelería'];

export const createProduct = (p = {}) => ({
  id: p.id ?? String(Date.now()),
  name: p.name?.trim() ?? '',
  code: p.code?.trim() ?? '',
  category: p.category ?? CATEGORIES[0],
  stock: Number(p.stock ?? 0),
  minStock: Number(p.minStock ?? 0),
  location: p.location?.trim() ?? '',
  image: p.image ?? null, // URL remota o URI local (galería)
  createdAt: p.createdAt ?? new Date().toISOString(),
});

export const isLowStock = (p) => p.stock < p.minStock;
