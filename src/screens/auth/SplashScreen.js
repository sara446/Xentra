import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Button from '../../components/Button';
import { ROUTES } from '../../navigation/routeNames';
import { colors } from '../../theme';

export default function SplashScreen({ navigation }) {
  return (
    <View style={styles.root}>
      <View style={styles.center}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.brand}>Xentra</Text>
        <Text style={styles.sub}>INVENTORY PRO</Text>
        <Text style={styles.tag}>Controlar hoy para decidir mejor mañana</Text>
      </View>
      <Button title="Continuar" variant="accent" onPress={() => navigation.replace(ROUTES.LOGIN)} style={styles.btn} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.navy, padding: 24, paddingBottom: 48 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 96, height: 96 },
  brand: { color: colors.white, fontSize: 32, fontWeight: '800', marginTop: 16 },
  sub: { color: '#9AA5D1', fontSize: 11, letterSpacing: 2, marginTop: 2 },
  tag: { color: '#C9D0EE', fontSize: 13, marginTop: 28, textAlign: 'center' },
  btn: { alignSelf: 'stretch' },
});
