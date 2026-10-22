import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import ScreenHeader from '../../components/ScreenHeader';
import ProductCard from '../../components/ProductCard';
import ProductController from '../../controllers/ProductController';
import { ROUTES } from '../../navigation/routeNames';
import { colors, radius, font } from '../../theme';

const FILTERS = ['Todos', 'Nombre', 'Código', 'Categoría'];

export default function InventoryScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Todos');

  const load = useCallback(() => { ProductController.getAll(query, filter).then(setProducts); }, [query, filter]);
  useFocusEffect(load);

  return (
    <Screen
      contentStyle={{ paddingBottom: 24 }}
    >
      <ScreenHeader
        title="Inventario"
        right={
          <TouchableOpacity style={styles.add} onPress={() => navigation.navigate(ROUTES.ADD_PRODUCT)}>
            <Ionicons name="add" size={20} color={colors.navy} />
          </TouchableOpacity>
        }
      />
      <View style={styles.search}>
        <Ionicons name="search" size={18} color={colors.muted} />
        <TextInput style={styles.searchInput} placeholder="Buscar por nombre o código..." placeholderTextColor="#A0A6BD" value={query} onChangeText={setQuery} />
      </View>
      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[styles.chip, filter === f && styles.chipActive]}>
            <Text style={[styles.chipText, filter === f && { color: colors.white }]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {products.length === 0 ? <Text style={[font.small, { textAlign: 'center', marginTop: 30 }]}>No hay productos que coincidan.</Text> : null}
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onPress={() => navigation.navigate(ROUTES.PRODUCT_DETAIL, { id: p.id })} />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  add: { width: 34, height: 34, borderRadius: 10, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, height: 44, marginBottom: 12 },
  searchInput: { flex: 1, color: colors.navy, fontSize: 14 },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.pill, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  chipText: { fontSize: 12, fontWeight: '700', color: colors.navy },
});
