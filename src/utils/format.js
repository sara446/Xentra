const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export const formatDate = (iso) => {
  const d = new Date(iso);
  return `${d.getDate()} de ${MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
};

export const formatInputDate = (d = new Date()) => {
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
};

export const formatRelative = (iso) => {
  const d = new Date(iso);
  const time = d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
  const today = new Date().setHours(0, 0, 0, 0);
  const diff = Math.round((today - new Date(d).setHours(0, 0, 0, 0)) / 86400000);
  if (diff === 0) return `Hoy, ${time}`;
  if (diff === 1) return `Ayer, ${time}`;
  return `${d.getDate()} de ${MONTHS[d.getMonth()]}, ${time}`;
};

export const isEmail = (v) => /\S+@\S+\.\S+/.test(v);

// "1 unidad" / "5 unidades"
export const units = (n) => `${n} ${Math.abs(Number(n)) === 1 ? 'unidad' : 'unidades'}`;
