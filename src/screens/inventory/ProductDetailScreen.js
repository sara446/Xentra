import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import ScreenHeader from '../../components/ScreenHeader';
import ProductImage from '../../components/ProductImage';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { useModal } from '../../components/AppModal';
import ProductController from '../../controllers/ProductController';
import { isLowStock } from '../../models/Product';
import { MOVEMENT_TYPES } from '../../models/Movement';
import { formatDate } from '../../utils/format';
import { ROUTES } from '../../navigation/routeNames';
import { colors, radius, font } from '../../theme';

const Row = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={font.small}>{label}</Text>
    <Text style={styles.rowValue}>{value || '—'}</Text>
  </View>
);

export default function ProductDetailScreen({ navigation, route }) {
  const { id } = route.params;
  const [p, setP] = useState(null);
  const showModal = useModal();

  useFocusEffect(useCallback(() => { ProductController.getById(id).then(setP).catch(() => navigation.goBack()); }, [id]));

  const onDelete = () =>
    showModal({
      type: 'confirm',
      title: '¿Eliminar producto?',
      message: `"${p.name}" se eliminará del inventario. Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      onConfirm: async () => { await ProductController.remove(id); navigation.goBack(); },
    });

  if (!p) return <Screen><ScreenHeader title="Detalle del producto" onBack={() => navigation.goBack()} /></Screen>;
  const low = isLowStock(p);

  return (
    <Screen>
      <ScreenHeader title="Detalle del producto" onBack={() => navigation.goBack()} />
      {low ? (
        <View style={styles.alert}>
          <Ionicons name="warning-outline" size={18} color="#B7791F" />
          <Text style={styles.alertText}>Atención: stock actual por debajo del límite mínimo.</Text>
        </View>
      ) : null}

      <ProductImage uri={p.image} size={220} rounded={radius.lg} style={{ alignSelf: 'center', marginBottom: 16, width: '100%' }} />

      <View style={styles.card}>
        <View style={styles.titleRow}>
          <Text style={[font.h2, { flex: 1 }]}>{p.name}</Text>
          <Badge tone={low ? 'low' : 'normal'} label={low ? 'Stock bajo' : 'Normal'} />
        </View>
        <Text style={[font.small, { marginTop: 2 }]}>Código: {p.code}</Text>

        <View style={styles.qtyRow}>
          <View>
            <Text style={styles.qtyLabel}>CANTIDAD DISPONIBLE</Text>
            <Text style={[styles.qty, low && { color: colors.danger }]}>{p.stock} <Text style={styles.unit}>{p.stock === 1 ? 'unidad' : 'unidades'}</Text></Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.qtyLabel}>LÍMITE MÍNIMO</Text>
            <Text style={styles.min}>{p.minStock} u</Text>
          </View>
        </View>

        <Row label="Categoría" value={p.category} />
        <Row label="Ubicación" value={p.location ? `Almacén ${p.location}` : ''} />
        <Row label="Fecha de registro" value={formatDate(p.createdAt)} />
      </View>

      <Button title="Registrar movimiento" onPress={() => navigation.navigate(ROUTES.ADD_MOVEMENT, { productId: id, type: MOVEMENT_TYPES.IN })} style={{ marginTop: 16 }} />
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
        <Button title="Editar producto" variant="outline" style={{ flex: 1 }} onPress={() => navigation.navigate(ROUTES.EDIT_PRODUCT, { id })} />
        <Button title="Eliminar" variant="danger" style={{ flex: 1 }} onPress={onDelete} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  alert: { flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: colors.warningBg, borderColor: colors.warningBorder, borderWidth: 1, borderRadius: radius.md, padding: 12, marginBottom: 14 },
  alertText: { flex: 1, fontSize: 12, color: '#7A5A12', fontWeight: '600' },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: colors.border },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  qtyRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  qtyLabel: { fontSize: 10, color: colors.muted, fontWeight: '600' },
  qty: { fontSize: 30, fontWeight: '800', color: colors.navy },
  unit: { fontSize: 14, fontWeight: '600' },
  min: { fontSize: 22, fontWeight: '800', color: colors.navy },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7 },
  rowValue: { fontSize: 13, fontWeight: '700', color: colors.navy, flexShrink: 1, textAlign: 'right' },
});
