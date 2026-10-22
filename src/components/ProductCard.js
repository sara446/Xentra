import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ProductImage from './ProductImage';
import Badge from './Badge';
import { isLowStock } from '../models/Product';
import { colors, radius, font } from '../theme';

export default function ProductCard({ product, onPress }) {
  const low = isLowStock(product);
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={[styles.card, low && styles.cardLow]}>
      <ProductImage uri={product.image} size={64} />
      <View style={styles.info}>
        <View style={styles.top}>
          <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
          <Badge tone={low ? 'low' : 'normal'} label={low ? 'Stock bajo' : 'Normal'} />
        </View>
        <Text style={font.small} numberOfLines={1}>{product.code} • {product.category}</Text>
        <View style={styles.qty}>
          <View>
            <Text style={styles.qtyLabel}>DISPONIBLE</Text>
            <Text style={[styles.qtyValue, low && { color: colors.danger }]}>{product.stock} u</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.qtyLabel}>MÍNIMO</Text>
            <Text style={styles.qtyValue}>{product.minStock} u</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: colors.white, borderRadius: radius.md, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  cardLow: { backgroundColor: colors.warningBg, borderColor: colors.warningBorder },
  info: { flex: 1, marginLeft: 12 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 },
  name: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.navy },
  qty: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  qtyLabel: { fontSize: 10, color: colors.muted, fontWeight: '600' },
  qtyValue: { fontSize: 16, fontWeight: '800', color: colors.navy },
});
