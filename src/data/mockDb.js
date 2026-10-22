import { createProduct } from '../models/Product';
import { createMovement } from '../models/Movement';
import { createUser } from '../models/User';

const img = (keyword, lock) => `https://loremflickr.com/400/400/${keyword}?lock=${lock}`;
const daysAgo = (n, h = 10, m = 30) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

export const db = {
  products: [
    createProduct({ id: '1', name: 'Laptop Dell Vostro 3400', code: 'TEC-DEL-3400', category: 'Tecnología', stock: 15, minStock: 5, location: 'Estante A-10', image: img('laptop', 1), createdAt: '2026-01-10T10:00:00Z' }),
    createProduct({ id: '2', name: 'Mouse Inalámbrico Logitech', code: 'ACC-LOG-M185', category: 'Accesorios de Oficina', stock: 3, minStock: 10, location: 'Estante B-12', image: img('computer,mouse', 2), createdAt: '2026-01-14T10:00:00Z' }),
    createProduct({ id: '3', name: 'Monitor LG Pro 27"', code: 'TEC-LGP-27', category: 'Tecnología', stock: 8, minStock: 2, location: 'Estante A-04', image: img('monitor,desk', 3), createdAt: '2026-01-12T10:00:00Z' }),
    createProduct({ id: '4', name: 'Cable HDMI 4K 1.8m', code: 'ACC-CAB-HDMI', category: 'Accesorios', stock: 1, minStock: 15, location: 'Estante A-10', image: img('cable,hdmi', 4), createdAt: '2026-01-15T10:00:00Z' }),
  ],
  movements: [
    createMovement({ id: 'm1', productId: '1', productName: 'Laptop Dell Vostro 3400', productCode: 'TEC-DEL-3400', type: 'entrada', quantity: 10, user: 'Administrador', date: daysAgo(0) }),
    createMovement({ id: 'm2', productId: '2', productName: 'Mouse Inalámbrico Logitech', productCode: 'ACC-LOG-M185', type: 'salida', quantity: 3, user: 'Soporte Técnico', date: daysAgo(1, 16, 15) }),
    createMovement({ id: 'm3', productId: '3', productName: 'Monitor LG Pro 27"', productCode: 'TEC-LGP-27', type: 'entrada', quantity: 5, user: 'Administrador', date: daysAgo(3, 14, 0) }),
    createMovement({ id: 'm4', productId: '4', productName: 'Cable HDMI 4K 1.8m', productCode: 'ACC-CAB-HDMI', type: 'salida', quantity: 15, user: 'Soporte Técnico', date: daysAgo(4, 9, 30) }),
  ],
  users: [
    createUser({ id: 'u1', name: 'Carlos Mendoza', email: 'soporte@xentra.com', password: '123456', role: 'Administrador de Inventario' }),
    createUser({ id: 'u2', name: 'Ana Laura Gómez', email: 'a.gomez@xentra.com', password: '123456', role: 'Empleado' }),
    createUser({ id: 'u3', name: 'Roberto Díaz', email: 'r.diaz@xentra.com', password: '123456', role: 'Empleado', active: false }),
    createUser({ id: 'u4', name: 'Elena Rostova', email: 'e.rostova@xentra.com', password: '123456', role: 'Empleado' }),
  ],
};
