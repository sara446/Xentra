export const ROLES = ['Administrador de Inventario', 'Empleado'];

export const createUser = (u = {}) => ({
  id: u.id ?? String(Date.now()),
  name: u.name ?? '',
  email: u.email ?? '',
  password: u.password ?? '',
  role: u.role ?? 'Empleado',
  active: u.active ?? true,
});
