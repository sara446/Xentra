import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Screen from '../../components/Screen';
import ScreenHeader from '../../components/ScreenHeader';
import Button from '../../components/Button';
import ProductImage from '../../components/ProductImage';
import MovementController from '../../controllers/MovementController';
import ProductController from '../../controllers/ProductController';
import { MOVEMENT_TYPES } from '../../models/Movement';
import { formatRelative, units } from '../../utils/format';
import { ROUTES } from '../../navigation/routeNames';
import { colors, radius, font } from '../../theme';

const TABS = ['Todos', 'Entradas', 'Salidas'];

export default function MovementsScreen({ navigation }) {
  const [tab, setTab] = useState('Todos');
  const [list, setList] = useState([]);
  const [images, setImages] = useState({});

  useFocusEffect(useCallback(() => {
    MovementController.getAll(tab).then(setList);
    ProductController.getAll().then((ps) => setImages(Object.fromEntries(ps.map((p) => [p.id, p.image]))));
  }, [tab]));

  return (
    <Screen>
      <ScreenHeader title="Movimientos" />
      <View style={styles.tabs}>
        {TABS.map((t) => (
          <TouchableOpacity key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]}>
            <Text style={[styles.tabText, tab === t && { color: colors.white }]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {list.map((m) => {
        const isIn = m.type === MOVEMENT_TYPES.IN;
        return (
          <View key={m.id} style={styles.card}>
            <ProductImage uri={images[m.productId]} size={46} rounded={10} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.top}>
                <Text style={styles.name} numberOfLines={1}>{m.productName}</Text>
                <View style={[styles.tag, { backgroundColor: isIn ? colors.successBg : colors.dangerBg }]}>
                  <Text style={[styles.tagText, { color: isIn ? colors.success : colors.danger }]}>{isIn ? 'Entrada' : 'Salida'}</Text>
                </View>
              </View>
              <Text style={font.small}>{m.productCode} • {m.user}</Text>
              <View style={styles.bottom}>
                <Text style={[styles.qty, { color: isIn ? colors.success : colors.danger }]}>{isIn ? '+' : '-'}{units(m.quantity)}</Text>
                <Text style={font.small}>{formatRelative(m.date)}</Text>
              </View>
            </View>
          </View>
        );
      })}
      {list.length === 0 ? <Text style={[font.small, { textAlign: 'center', marginTop: 30 }]}>Aún no hay movimientos.</Text> : null}

      <Button title="Nuevo movimiento" variant="accent" onPress={() => navigation.navigate(ROUTES.ADD_MOVEMENT)} style={{ marginTop: 10 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  tab: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: radius.pill, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  tabActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  tabText: { fontSize: 12, fontWeight: '700', color: colors.navy },
  card: { flexDirection: 'row', backgroundColor: colors.white, borderRadius: radius.md, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 6 },
  name: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.navy },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill },
  tagText: { fontSize: 11, fontWeight: '700' },
  bottom: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  qty: { fontSize: 13, fontWeight: '800' },
});
