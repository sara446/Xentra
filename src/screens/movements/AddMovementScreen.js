import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import ScreenHeader from '../../components/ScreenHeader';
import Select from '../../components/Select';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useModal } from '../../components/AppModal';
import { validateMovement, hasErrors } from '../../utils/validators';
import ProductController from '../../controllers/ProductController';
import MovementController from '../../controllers/MovementController';
import { MOVEMENT_TYPES } from '../../models/Movement';
import { formatInputDate, units } from '../../utils/format';
import { colors, radius, font } from '../../theme';

export default function AddMovementScreen({ navigation, route }) {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState(route.params?.productId ?? null);
  const [type, setType] = useState(route.params?.type ?? MOVEMENT_TYPES.IN);
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const showModal = useModal();
  const product = products.find((p) => p.id === productId);

  useEffect(() => {
    ProductController.getAll().then((ps) => {
      setProducts(ps);
      if (!productId && ps[0]) setProductId(ps[0].id);
    });
  }, []);

  const onSubmit = async () => {
    const e = validateMovement({ productId, quantity }, product, type);
    setErrors(e);
    if (hasErrors(e)) return;
    setLoading(true);
    try {
      const m = await MovementController.create({ productId, type, quantity, note });
      const updated = await ProductController.getById(productId);
      showModal({
        type: 'success',
        title: 'Movimiento registrado',
        message: `${m.type === MOVEMENT_TYPES.IN ? 'Entrada' : 'Salida'} de ${units(m.quantity)} de "${m.productName}". Stock actual: ${units(updated.stock)}.`,
        onClose: () => navigation.goBack(),
      });
    } catch (err) {
      setErrors({ quantity: err.message });
    } finally {
      setLoading(false);
    }
  };

  const Opt = ({ value, label, icon }) => {
    const active = type === value;
    const color = value === MOVEMENT_TYPES.IN ? colors.success : colors.danger;
    return (
      <TouchableOpacity
        onPress={() => { setType(value); setErrors({}); }}
        style={[styles.opt, active && { borderColor: color, backgroundColor: value === MOVEMENT_TYPES.IN ? colors.successBg : colors.dangerBg }]}
      >
        <Ionicons name={icon} size={16} color={active ? color : colors.muted} />
        <Text style={[styles.optText, active && { color }]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Screen>
      <ScreenHeader title="Registrar movimiento" onBack={() => navigation.goBack()} />
      <Text style={font.title}>Nuevo movimiento</Text>
      <Text style={[font.small, { marginBottom: 20 }]}>Registra una entrada o salida de inventario</Text>

      <Select
        label="Producto"
        value={productId}
        onChange={(v) => { setProductId(v); setErrors({}); }}
        options={products.map((p) => ({ value: p.id, label: p.name }))}
        error={errors.productId}
      />
      {product ? (
        <Text style={[font.small, { marginTop: -8, marginBottom: 14 }]}>
          Stock actual: <Text style={{ fontWeight: '800', color: colors.navy }}>{units(product.stock)}</Text> • Mínimo: {product.minStock}
        </Text>
      ) : null}

      <Text style={styles.label}>Tipo de movimiento</Text>
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
        <Opt value={MOVEMENT_TYPES.IN} label="Entrada" icon="arrow-down" />
        <Opt value={MOVEMENT_TYPES.OUT} label="Salida" icon="arrow-up" />
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Input style={{ flex: 1 }} label="Cantidad" value={quantity} onChangeText={(v) => { setQuantity(v); if (errors.quantity) setErrors({}); }} keyboardType="numeric" placeholder="5" error={errors.quantity} />
        <Input style={{ flex: 1 }} label="Fecha" value={formatInputDate()} editable={false} />
      </View>
      <Input label="Observación (Opcional)" value={note} onChangeText={setNote} placeholder="Abastecimiento de stock" autoCapitalize="sentences" />

      <Button title="Registrar movimiento" onPress={onSubmit} loading={loading} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { ...font.small, color: colors.navy, fontWeight: '600', marginBottom: 6 },
  opt: { flex: 1, flexDirection: 'row', gap: 6, justifyContent: 'center', alignItems: 'center', height: 44, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white },
  optText: { fontWeight: '700', color: colors.muted },
});
