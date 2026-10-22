import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import DashboardController from '../../controllers/DashboardController';
import AuthController from '../../controllers/AuthController';
import { MOVEMENT_TYPES } from '../../models/Movement';
import { ROUTES } from '../../navigation/routeNames';
import { colors, radius, font } from '../../theme';

const Stat = ({ label, value, icon, warn }) => (
  <View style={[styles.stat, warn && { backgroundColor: colors.warningBg, borderColor: colors.warningBorder }]}>
    <View style={styles.statTop}>
      <Text style={styles.statLabel}>{label}</Text>
      <Ionicons name={icon} size={18} color={warn ? '#B7791F' : colors.navy} />
    </View>
    <Text style={[styles.statValue, warn && { color: colors.danger }]}>{value}</Text>
  </View>
);

const Action = ({ label, icon, onPress, filled }) => (
  <TouchableOpacity style={styles.action} onPress={onPress}>
    <View style={[styles.actionIcon, filled && { backgroundColor: colors.accent, borderColor: colors.accent }]}>
      <Ionicons name={icon} size={22} color={colors.navy} />
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function HomeScreen({ navigation }) {
  const [s, setS] = useState({ totalProducts: 0, lowStock: 0, recentIn: 0, recentOut: 0 });
  const user = AuthController.getCurrentUser();
  const initials = (user?.name || 'U').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  useFocusEffect(useCallback(() => { DashboardController.getSummary().then(setS); }, []));

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={font.h2}>Hola, {user?.name?.split(' ')[0] || 'Usuario'}</Text>
          <Text style={font.small}>Panel general • Xentra</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate(ROUTES.TAB_ALERTS)}>
          <Ionicons name="notifications-outline" size={24} color={colors.navy} />
        </TouchableOpacity>
      </View>

      {s.lowStock > 0 ? (
        <View style={styles.alert}>
          <Ionicons name="warning-outline" size={18} color="#B7791F" />
          <Text style={styles.alertText}>Alerta: hay {s.lowStock} productos con stock bajo el límite mínimo.</Text>
        </View>
      ) : null}

      <View style={styles.grid}>
        <Stat label="Total de productos" value={s.totalProducts} icon="cube-outline" />
        <Stat label="Stock bajo" value={s.lowStock} icon="alert-circle-outline" warn />
        <Stat label="Entradas recientes" value={s.recentIn} icon="arrow-down-circle-outline" />
        <Stat label="Salidas recientes" value={s.recentOut} icon="arrow-up-circle-outline" />
      </View>

      <Text style={[font.h2, { marginTop: 22, marginBottom: 12 }]}>Acciones rápidas</Text>
      <View style={styles.actions}>
        <Action filled icon="add" label="Nuevo producto" onPress={() => navigation.navigate(ROUTES.ADD_PRODUCT)} />
        <Action icon="arrow-down" label="Reg. entrada" onPress={() => navigation.navigate(ROUTES.ADD_MOVEMENT, { type: MOVEMENT_TYPES.IN })} />
        <Action icon="arrow-up" label="Reg. salida" onPress={() => navigation.navigate(ROUTES.ADD_MOVEMENT, { type: MOVEMENT_TYPES.OUT })} />
        <Action icon="search" label="Inventario" onPress={() => navigation.navigate(ROUTES.TAB_INVENTORY)} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.white, fontWeight: '800' },
  alert: { flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: colors.warningBg, borderColor: colors.warningBorder, borderWidth: 1, borderRadius: radius.md, padding: 12, marginBottom: 16 },
  alertText: { flex: 1, fontSize: 12, color: '#7A5A12', fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  stat: { width: '47.5%', backgroundColor: colors.white, borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: colors.border },
  statTop: { flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { fontSize: 11, color: colors.muted, fontWeight: '600', flex: 1 },
  statValue: { fontSize: 30, fontWeight: '800', color: colors.navy, marginTop: 8 },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  action: { alignItems: 'center', width: '24%' },
  actionIcon: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: colors.navy, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: 11, color: colors.navy, marginTop: 6, textAlign: 'center', fontWeight: '600' },
});
