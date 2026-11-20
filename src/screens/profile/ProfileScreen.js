import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import ScreenHeader from '../../components/ScreenHeader';
import Button from '../../components/Button';
import { useModal } from '../../components/AppModal';

import { ROUTES } from '../../navigation/routeNames';
import { colors, radius, font } from '../../theme';
import { logout } from '../../services/authService';
// 🔧 CAMBIO 1: el usuario logueado ahora se lee del AuthContext (Firebase).
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const showModal = useModal();
  // 🔧 CAMBIO 2: antes era "AuthController.getCurrentUser()" (y AuthController ni siquiera estaba importado).
  const { user, isAdmin } = useAuth();
  const initials = (user?.name || 'U').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  // 🔧 CAMBIO 3: la función se llamaba "logout", igual que la importada de authService,
  //             y la tapaba. Se renombró a "handleLogout" y ahora cierra sesión en Firebase.
  const handleLogout = async () => {
    try {
      await logout();
      navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: ROUTES.LOGIN }] }));
    } catch (err) {
      showModal({ type: 'error', title: 'No se pudo cerrar sesión', message: 'Inténtalo de nuevo.' });
    }
  };

  return (
    <Screen>
      <ScreenHeader title="Perfil" />
      <View style={styles.card}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
        {/* 🔧 CAMBIO 4: valores de respaldo por si el perfil aún no carga */}
        <Text style={font.h2}>{user?.name || 'Usuario'}</Text>
        <Text style={font.small}>{user?.email}</Text>
        {user?.role ? <Text style={styles.role}>{user.role}</Text> : null}
      </View>

      {/* Solo los administradores ven la gestión de usuarios */}
      {isAdmin ? (
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate(ROUTES.USERS)}>
          <Ionicons name="people-outline" size={20} color={colors.navy} />
          <Text style={styles.itemText}>Gestión de usuarios</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </TouchableOpacity>
      ) : null}

      {/* 🔧 CAMBIO 5: onPress ahora usa handleLogout */}
      <Button title="Cerrar sesión" variant="danger" onPress={handleLogout} style={{ marginTop: 24 }} />
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
})