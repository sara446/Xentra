import { isEmail } from './format';

// Cada función devuelve un objeto { campo: 'mensaje de error' }.
// Si el objeto está vacío, el formulario es válido.

const isNonNegativeInt = (v) => /^\d+$/.test(String(v ?? '').trim());

export const validateLogin = ({ email, password }) => {
  const e = {};
  if (!email?.trim()) e.email = 'El correo es obligatorio.';
  else if (!isEmail(email.trim())) e.email = 'Ingresa un correo válido (ej. nombre@correo.com).';
  if (!password) e.password = 'La contraseña es obligatoria.';
  return e;
};

export const validateRegister = ({ name, email, password, confirm }) => {
  const e = {};
  if (!name?.trim()) e.name = 'Ingresa tu nombre completo.';
  else if (name.trim().length < 3) e.name = 'El nombre debe tener al menos 3 caracteres.';
  if (!email?.trim()) e.email = 'El correo es obligatorio.';
  else if (!isEmail(email.trim())) e.email = 'Ingresa un correo válido (ej. nombre@correo.com).';
  if (!password) e.password = 'La contraseña es obligatoria.';
  else if (password.length < 6) e.password = 'Debe tener al menos 6 caracteres.';
  if (!confirm) e.confirm = 'Confirma tu contraseña.';
  else if (password !== confirm) e.confirm = 'Las contraseñas no coinciden.';
  return e;
};

export const validateForgot = ({ email }) => {
  const e = {};
  if (!email?.trim()) e.email = 'El correo es obligatorio.';
  else if (!isEmail(email.trim())) e.email = 'Ingresa un correo válido (ej. nombre@correo.com).';
  return e;
};

export const validateProduct = ({ name, code, stock, minStock }, mode = 'create') => {
  const e = {};
  if (!name?.trim()) e.name = 'El nombre del producto es obligatorio.';
  if (!code?.trim()) e.code = 'El código o referencia es obligatorio.';
  if (String(stock ?? '').trim() === '') e.stock = 'Ingresa la cantidad.';
  else if (!isNonNegativeInt(stock)) e.stock = 'Debe ser un número entero mayor o igual a 0.';
  if (mode === 'create') {
    if (String(minStock ?? '').trim() === '') e.minStock = 'Ingresa el stock mínimo.';
    else if (!isNonNegativeInt(minStock)) e.minStock = 'Debe ser un número entero mayor o igual a 0.';
  }
  return e;
};

export const validateMovement = ({ productId, quantity }, product, type) => {
  const e = {};
  if (!productId) e.productId = 'Selecciona un producto.';
  if (String(quantity ?? '').trim() === '') e.quantity = 'Ingresa la cantidad.';
  else if (!/^\d+$/.test(String(quantity).trim()) || Number(quantity) <= 0) e.quantity = 'Debe ser un número entero mayor a 0.';
  else if (type === 'salida' && product && Number(quantity) > product.stock) e.quantity = `Solo hay ${product.stock} unidades disponibles.`;
  return e;
};

export const hasErrors = (e) => Object.keys(e).length > 0;
