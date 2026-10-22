import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Input from './Input';
import Select from './Select';
import Button from './Button';
import ProductImage from './ProductImage';
import { useModal } from './AppModal';
import { validateProduct, hasErrors } from '../utils/validators';
import { CATEGORIES } from '../models/Product';
import { colors, font } from '../theme';

// mode: 'create' | 'edit'
export default function ProductForm({ initial = {}, mode = 'create', onSubmit, onCancel, onDelete }) {
  const [form, setForm] = useState({
    name: '', code: '', category: CATEGORIES[1], location: '', image: null, ...initial,
    stock: initial.stock != null ? String(initial.stock) : '',
    minStock: initial.minStock != null ? String(initial.minStock) : '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const showModal = useModal();
  const set = (k) => (v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return showModal({ type: 'info', title: 'Permiso requerido', message: 'Permite el acceso a tus fotos para agregar una imagen.' });
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.7 });
    if (!res.canceled) set('image')(res.assets[0].uri);
  };

  const submit = async () => {
    const e = validateProduct(form, mode);
    setErrors(e);
    if (hasErrors(e)) return;
    setLoading(true);
    try {
      await onSubmit({ ...form, stock: Number(form.stock), minStock: Number(form.minStock) });
    } catch (err) {
      showModal({ type: 'error', title: 'No se pudo guardar', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <View style={styles.imageRow}>
        <ProductImage uri={form.image} size={88} />
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={styles.imageTitle}>Imagen del producto</Text>
          <TouchableOpacity style={styles.pick} onPress={pickImage}>
            <Ionicons name="image-outline" size={16} color={colors.navy} />
            <Text style={styles.pickText}>{form.image ? 'Cambiar imagen' : 'Agregar imagen'}</Text>
          </TouchableOpacity>
          {form.image ? (
            <TouchableOpacity onPress={() => set('image')(null)}>
              <Text style={styles.remove}>Quitar imagen</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <Input label="Nombre del producto" value={form.name} onChangeText={set('name')} placeholder="Teclado Mecánico RGB" autoCapitalize="sentences" error={errors.name} />
      <Input label="Código de barra o referencia" value={form.code} onChangeText={set('code')} placeholder="TEC-MEC-RGB" autoCapitalize="characters" error={errors.code} />
      {mode === 'create' ? (
        <Select label="Categoría" value={form.category} onChange={set('category')} options={CATEGORIES.map((c) => ({ value: c, label: c }))} />
      ) : null}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Input style={{ flex: 1 }} label={mode === 'create' ? 'Cantidad inicial' : 'Cantidad actual'} value={form.stock} onChangeText={set('stock')} keyboardType="numeric" placeholder="25" error={errors.stock} />
        {mode === 'create' ? (
          <Input style={{ flex: 1 }} label="Stock mínimo" value={form.minStock} onChangeText={set('minStock')} keyboardType="numeric" placeholder="5" error={errors.minStock} />
        ) : null}
      </View>
      <Input label="Ubicación en almacén (Opcional)" value={form.location} onChangeText={set('location')} placeholder="Estante A-10" autoCapitalize="sentences" />

      {hasErrors(errors) ? (
        <Text style={styles.summary}>Revisa los campos marcados en rojo.</Text>
      ) : null}
      <Button
        title={mode === 'create' ? 'Guardar producto' : 'Guardar cambios'}
        variant={mode === 'create' ? 'primary' : 'accent'}
        onPress={submit}
        loading={loading}
        style={{ marginTop: 6 }}
      />
      {mode === 'edit' ? (
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
          <Button title="Cancelar" variant="outline" onPress={onCancel} style={{ flex: 1 }} />
          <Button title="Eliminar" variant="danger" onPress={onDelete} style={{ flex: 1 }} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  imageRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  imageTitle: { ...font.body, fontWeight: '700', marginBottom: 8 },
  pick: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1.5, borderColor: colors.navy, backgroundColor: colors.white },
  pickText: { color: colors.navy, fontWeight: '700', fontSize: 13 },
  summary: { color: colors.danger, fontSize: 12, fontWeight: '600', marginBottom: 8, textAlign: 'center' },
  remove: { color: colors.danger, fontSize: 12, fontWeight: '600', marginTop: 8 },
});
