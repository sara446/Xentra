export const MOVEMENT_TYPES = { IN: 'entrada', OUT: 'salida' };

export const createMovement = (m = {}) => ({
  id: m.id ?? String(Date.now()),
  productId: m.productId,
  productName: m.productName ?? '',
  productCode: m.productCode ?? '',
  type: m.type ?? MOVEMENT_TYPES.IN,
  quantity: Number(m.quantity ?? 0),
  note: m.note ?? '',
  user: m.user ?? 'Administrador',
  date: m.date ?? new Date().toISOString(),
});
