import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Input from '../../components/Input';
import Button from '../../components/Button';
import AuthController from '../../controllers/AuthController';
import { validateLogin, hasErrors } from '../../utils/validators';
import { ROUTES } from '../../navigation/routeNames';
import { colors, radius, font } from '../../theme';

export default function LoginScreen({ navigation }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k) => (v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined, general: undefined }));
  };

  const onLogin = async () => {
    const e = validateLogin(form);
    setErrors(e);
    if (hasErrors(e)) return;
    setLoading(true);
    try {
      await AuthController.login(form.email, form.password);
      navigation.reset({ index: 0, routes: [{ name: ROUTES.MAIN }] });
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setForm({ email: 'soporte@xentra.com', password: '123456' });
    setErrors({});
  };

  return (
    <Screen contentStyle={{ paddingTop: 40 }}>
      <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
      <Text style={styles.brand}>Xentra</Text>
      <Text style={styles.sub}>INVENTORY PRO</Text>

      <Text style={[font.title, { marginTop: 28 }]}>Bienvenido de nuevo</Text>
      <Text style={[font.small, { marginBottom: 22 }]}>Ingresa tus credenciales para acceder</Text>

      {errors.general ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={18} color={colors.danger} />
          <Text style={styles.errorText}>{errors.general}</Text>
        </View>
      ) : null}

      <Input label="Correo electrónico" value={form.email} onChangeText={set('email')} placeholder="nombre@correo.com" keyboardType="email-address" error={errors.email} />
      <Input label="Contraseña" value={form.password} onChangeText={set('password')} placeholder="Tu contraseña" secure error={errors.password} />
      <TouchableOpacity onPress={() => navigation.navigate(ROUTES.FORGOT)} style={{ alignSelf: 'flex-end', marginBottom: 18 }}>
        <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      <Button title="Iniciar sesión" onPress={onLogin} loading={loading} />

      <TouchableOpacity onPress={fillDemo} style={styles.demo}>
        <Ionicons name="flash-outline" size={14} color={colors.muted} />
        <Text style={font.small}>Usar cuenta de prueba (soporte@xentra.com / 123456)</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={font.small}>¿No tienes una cuenta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate(ROUTES.REGISTER)}>
          <Text style={styles.link}>Regístrate</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  logo: { width: 48, height: 48, borderRadius: 12 },
  brand: { fontSize: 20, fontWeight: '800', color: colors.navy, marginTop: 8 },
  sub: { fontSize: 10, letterSpacing: 1.5, color: colors.muted },
  link: { color: colors.navy, fontWeight: '700', fontSize: 12 },
  errorBox: { flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: colors.dangerBg, borderRadius: radius.md, padding: 12, marginBottom: 14 },
  errorText: { flex: 1, color: colors.danger, fontSize: 13, fontWeight: '600' },
  demo: { flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
});
