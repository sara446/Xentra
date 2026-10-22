import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import ScreenHeader from '../../components/ScreenHeader';
import Badge from '../../components/Badge';
import UserController from '../../controllers/UserController';
import { ROUTES } from '../../navigation/routeNames';
import { colors, radius, font } from '../../theme';

export default function UsersScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const load = useCallback(() => { UserController.getAll(query).then(setUsers); }, [query]);
  useFocusEffect(load);

  const toggle = async (u) => { await UserController.toggleActive(u.id); load(); };

  return (
    <Screen>
      <ScreenHeader
        title="Usuarios"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity style={styles.add} onPress={() => navigation.navigate(ROUTES.ADD_USER)}>
            <Text style={styles.addText}>+ Agregar</Text>
          </TouchableOpacity>
        }
      />
      <View style={styles.search}>
        <Ionicons name="search" size={18} color={colors.muted} />
        <TextInput style={styles.searchInput} placeholder="Buscar usuario o correo..." placeholderTextColor="#A0A6BD" value={query} onChangeText={setQuery} />
      </View>
      {users.length === 0 ? <Text style={[font.small, { textAlign: 'center', marginTop: 30 }]}>No se encontraron usuarios.</Text> : null}
      {users.map((u) => (
        <View key={u.id} style={styles.card}>
          <View style={{ flex: 1 }}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{u.name}</Text>
              <Badge tone={u.active ? 'active' : 'inactive'} label={u.active ? 'Activo' : 'Inactivo'} />
            </View>
            <Text style={font.small}>{u.email}</Text>
            <Text style={styles.role}>{u.role.startsWith('Admin') ? 'Administrador' : 'Empleado'}</Text>
          </View>
          <TouchableOpacity onPress={() => toggle(u)} hitSlop={10}>
            <Ionicons name={u.active ? 'toggle' : 'toggle-outline'} size={34} color={u.active ? colors.success : colors.muted} />
          </TouchableOpacity>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  add: { backgroundColor: colors.navy, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  addText: { color: colors.white, fontWeight: '700', fontSize: 12 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, height: 44, marginBottom: 14 },
  searchInput: { flex: 1, color: colors.navy, fontSize: 14 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: radius.md, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  name: { fontSize: 14, fontWeight: '700', color: colors.navy },
  role: { fontSize: 12, fontWeight: '700', color: colors.navy, marginTop: 6 },
});
