import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import ProductImage from '../../components/ProductImage';
import Badge from '../../components/Badge';
import AlertController from '../../controllers/AlertController';
import { units } from '../../utils/format';
import { ROUTES } from '../../navigation/routeNames';
import { colors, radius, font } from '../../theme';

export default function AlertsScreen({ navigation }) {
  const [items, setItems] = useState([]);
  useFocusEffect(useCallback(() => { AlertController.getLowStock().then(setItems); }, []));

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={font.title}>Alertas</Text>
        {items.length > 0 ? <View style={styles.count}><Text style={styles.countText}>{items.length}</Text></View> : null}
        <View style={{ flex: 1 }} />
        <Ionicons name="notifications-outline" size={24} color={colors.navy} />
      </View>

      {items.length > 0 ? (
        <View style={styles.banner}>
          <Ionicons name="warning-outline" size={18} color="#B7791F" />
          <Text style={styles.bannerText}>Acción requerida: productos con nivel de stock urgente.</Text>
        </View>
      ) : (
        <Text style={[font.small, { textAlign: 'center', marginTop: 40 }]}>Todo en orden. No hay productos con stock bajo.</Text>
      )}

      {items.map((p) => (
        <View key={p.id} style={styles.card}>
          <View style={styles.top}>
            <ProductImage uri={p.image} size={48} rounded={10} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.titleRow}>
                <Text style={styles.name} numberOfLines={1}>{p.name}</Text>
                <Badge tone="critical" label="Crítico" />
              </View>
              <Text style={font.small}>{p.code} • Almacén {p.location || '—'}</Text>
            </View>
          </View>
          <View style={styles.qtyRow}>
            <View>
              <Text style={styles.qtyLabel}>STOCK DISPONIBLE</Text>
              <Text style={[styles.qty, { color: colors.danger }]}>{units(p.stock)}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.qtyLabel}>STOCK MÍNIMO</Text>
              <Text style={styles.qty}>{p.minStock} u</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.link} onPress={() => navigation.navigate(ROUTES.PRODUCT_DETAIL, { id: p.id })}>
            <Text style={styles.linkText}>Consultar producto</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.navy} />
          </TouchableOpacity>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  count: { backgroundColor: colors.danger, borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  countText: { color: colors.white, fontSize: 11, fontWeight: '800' },
  banner: { flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: colors.warningBg, borderColor: colors.warningBorder, borderWidth: 1, borderRadius: radius.md, padding: 12, marginBottom: 14 },
  bannerText: { flex: 1, fontSize: 12, color: '#7A5A12', fontWeight: '600' },
  card: { backgroundColor: colors.warningBg, borderColor: colors.warningBorder, borderWidth: 1, borderRadius: radius.md, padding: 14, marginBottom: 12 },
  top: { flexDirection: 'row', alignItems: 'center' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 6 },
  name: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.navy },
  qtyRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  qtyLabel: { fontSize: 10, color: colors.muted, fontWeight: '600' },
  qty: { fontSize: 16, fontWeight: '800', color: colors.navy },
  link: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginTop: 12, gap: 2 },
  linkText: { fontSize: 12, fontWeight: '700', color: colors.navy },
});
