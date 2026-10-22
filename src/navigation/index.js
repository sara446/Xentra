import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ROUTES } from './routeNames';
import { colors } from '../theme';

import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import HomeScreen from '../screens/home/HomeScreen';
import InventoryScreen from '../screens/inventory/InventoryScreen';
import ProductDetailScreen from '../screens/inventory/ProductDetailScreen';
import AddProductScreen from '../screens/inventory/AddProductScreen';
import EditProductScreen from '../screens/inventory/EditProductScreen';
import MovementsScreen from '../screens/movements/MovementsScreen';
import AddMovementScreen from '../screens/movements/AddMovementScreen';
import AlertsScreen from '../screens/alerts/AlertsScreen';
import UsersScreen from '../screens/users/UsersScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Root = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const stackOptions = { headerShown: false };

// Pantallas compartidas: se registran en cada pila para que la barra inferior siga visible.
const sharedScreens = (Stack) => (
  <>
    <Stack.Screen name={ROUTES.PRODUCT_DETAIL} component={ProductDetailScreen} />
    <Stack.Screen name={ROUTES.ADD_PRODUCT} component={AddProductScreen} />
    <Stack.Screen name={ROUTES.EDIT_PRODUCT} component={EditProductScreen} />
    <Stack.Screen name={ROUTES.ADD_MOVEMENT} component={AddMovementScreen} />
    <Stack.Screen name={ROUTES.USERS} component={UsersScreen} />
    <Stack.Screen name={ROUTES.ADD_USER} component={RegisterScreen} initialParams={{ fromAdmin: true }} />
  </>
);

const makeStack = (initial, component) => {
  const Stack = createNativeStackNavigator();
  return function StackNavigator() {
    return (
      <Stack.Navigator screenOptions={stackOptions}>
        <Stack.Screen name={initial} component={component} />
        {sharedScreens(Stack)}
      </Stack.Navigator>
    );
  };
};

const HomeStack = makeStack(ROUTES.HOME, HomeScreen);
const InventoryStack = makeStack(ROUTES.INVENTORY, InventoryScreen);
const MovementsStack = makeStack(ROUTES.MOVEMENTS, MovementsScreen);
const AlertsStack = makeStack(ROUTES.ALERTS, AlertsScreen);
const ProfileStack = makeStack(ROUTES.PROFILE, ProfileScreen);

const TABS = [
  { name: ROUTES.TAB_HOME, label: 'Inicio', icon: 'home-outline', component: HomeStack },
  { name: ROUTES.TAB_INVENTORY, label: 'Inventario', icon: 'cube-outline', component: InventoryStack },
  { name: ROUTES.TAB_MOVEMENTS, label: 'Movimientos', icon: 'swap-vertical', component: MovementsStack },
  { name: ROUTES.TAB_ALERTS, label: 'Alertas', icon: 'notifications-outline', component: AlertsStack },
  { name: ROUTES.TAB_PROFILE, label: 'Perfil', icon: 'person-outline', component: ProfileStack },
];

function MainTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.navy,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
        tabBarStyle: { height: 62 + insets.bottom, paddingBottom: insets.bottom + 6, paddingTop: 6, backgroundColor: colors.white, borderTopColor: colors.border },
      }}
    >
      {TABS.map((t) => (
        <Tab.Screen
          key={t.name}
          name={t.name}
          component={t.component}
          options={{
            tabBarLabel: t.label,
            tabBarIcon: ({ focused }) => (
              <View style={[styles.icon, focused && styles.iconActive]}>
                <Ionicons name={t.icon} size={20} color={colors.navy} style={{ opacity: focused ? 1 : 0.55 }} />
              </View>
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.bg } }}>
      <Root.Navigator initialRouteName={ROUTES.SPLASH} screenOptions={stackOptions}>
        <Root.Screen name={ROUTES.SPLASH} component={SplashScreen} />
        <Root.Screen name={ROUTES.LOGIN} component={LoginScreen} />
        <Root.Screen name={ROUTES.REGISTER} component={RegisterScreen} />
        <Root.Screen name={ROUTES.FORGOT} component={ForgotPasswordScreen} />
        <Root.Screen name={ROUTES.MAIN} component={MainTabs} />
      </Root.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  icon: { width: 38, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  iconActive: { backgroundColor: colors.accent },
});
