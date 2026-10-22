import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import ScreenHeader from '../../components/ScreenHeader';
import Button from '../../components/Button';
import AuthController from '../../controllers/AuthController';
import { ROUTES } from '../../navigation/routeNames';
import { colors, radius, font } from '../../theme';

export default function ProfileScreen({ navigation }) {
  const user = AuthController.getCurrentUser();
  const initials = (user?.name || 'U').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  const logout = () => {
    AuthController.logout();
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: ROUTES.LOGIN }] }));
  };

  return (
    <Screen>
      <ScreenHeader title="Perfil" />
      <View style={styles.card}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
        <Text style={font.h2}>{user?.name}</Text>
        <Text style={font.small}>{user?.email}</Text>
        <Text style={styles.role}>{user?.role}</Text>
      </View>

      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate(ROUTES.USERS)}>
        <Ionicons name="people-outline" size={20} color={colors.navy} />
        <Text style={styles.itemText}>Gestión de usuarios</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      </TouchableOpacity>

      <Button title="Cerrar sesión" variant="danger" onPress={logout} style={{ marginTop: 24 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', backgroundColor: colors.white, borderRadius: radius.lg, padding: 22, borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  avatarText: { color: colors.white, fontSize: 24, fontWeight: '800' },
  role: { marginTop: 8, backgroundColor: colors.accent, color: colors.navy, fontWeight: '700', fontSize: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, overflow: 'hidden' },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.white, borderRadius: radius.md, padding: 16, borderWidth: 1, borderColor: colors.border },
  itemText: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.navy },
});
