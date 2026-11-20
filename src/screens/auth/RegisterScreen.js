import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Screen from '../../components/Screen';
import ScreenHeader from '../../components/ScreenHeader';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';
import { useModal } from '../../components/AppModal';
import { register, getAuthErrorMessage } from '../../services/authService';
import UserController from '../../controllers/UserController';
import { ROLES } from '../../models/User';
import { validateRegister, hasErrors } from '../../utils/validators';
import { ROUTES } from '../../navigation/routeNames';
import { colors, font } from '../../theme';

// Errores de Firebase que se muestran debajo de un campo (los del backend traen "field").
const FIELD_ERRORS = {
  'auth/email-already-in-use': 'email',
  'auth/invalid-email': 'email',
  'auth/weak-password': 'password',
};

// Se usa desde Login (auto-registro) y desde Gestión de usuarios (route.params.fromAdmin).
// - Auto-registro: el backend asigna el rol (el primer usuario es Administrador, los demás Empleado).
// - Desde Gestión de usuarios: el administrador elige el rol.
export default function RegisterScreen({ navigation, route }) {
  const fromAdmin = !!route.params?.fromAdmin;
  const showModal = useModal();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: ROLES[1] });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k) => (v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const onSubmit = async () => {
    const e = validateRegister(form);
    setErrors(e);
    if (hasErrors(e)) return;
    setLoading(true);
    try {
      const data = { name: form.name.trim(), email: form.email, password: form.password };

      if (fromAdmin) {
        await UserController.create({ ...data, role: form.role });
      } else {
        await register(data);
      }

      showModal({
        type: 'success',
        title: fromAdmin ? 'Usuario creado' : 'Cuenta creada',
        message: fromAdmin ? `${form.name} ya puede iniciar sesión en Xentra.` : 'Tu cuenta se creó correctamente. Ya puedes iniciar sesión.',
        confirmText: 'Continuar',
        onClose: () => (fromAdmin ? navigation.goBack() : navigation.navigate(ROUTES.LOGIN)),
      });
    } catch (err) {
      const message = getAuthErrorMessage(err);
      const field = err.field || FIELD_ERRORS[err.code];
      if (field && field !== 'role') setErrors({ [field]: message });
      else showModal({ type: 'error', title: fromAdmin ? 'No se pudo crear el usuario' : 'No se pudo crear la cuenta', message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <ScreenHeader title={fromAdmin ? 'Nuevo usuario' : 'Registro Xentra'} onBack={() => navigation.goBack()} />
      <Text style={font.title}>{fromAdmin ? 'Agregar usuario' : 'Crear nueva cuenta'}</Text>
      <Text style={[font.small, { marginBottom: 20 }]}>Completa el formulario para registrar{fromAdmin ? ' al usuario' : 'te'}</Text>
      <Input label="Nombre completo" value={form.name} onChangeText={set('name')} placeholder="Juan Pérez" autoCapitalize="words" error={errors.name} />
      <Input label="Correo electrónico" value={form.email} onChangeText={set('email')} placeholder="juan.perez@correo.com" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} error={errors.email} />
      <Input label="Contraseña" value={form.password} onChangeText={set('password')} placeholder="Mínimo 6 caracteres" secure error={errors.password} />
      <Input label="Confirmar contraseña" value={form.confirm} onChangeText={set('confirm')} placeholder="Repite la contraseña" secure error={errors.confirm} />
      {/* Solo el administrador elige el rol */}
      {fromAdmin ? (
        <Select label="Rol" value={form.role} onChange={set('role')} options={ROLES.map((r) => ({ value: r, label: r }))} />
      ) : null}
      <Button title={fromAdmin ? 'Crear usuario' : 'Crear cuenta'} onPress={onSubmit} loading={loading} />
      {!fromAdmin ? (
        <View style={styles.footer}>
          <Text style={font.small}>¿Ya tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.LOGIN)}>
            <Text style={styles.link}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  link: { color: colors.navy, fontWeight: '700', fontSize: 12 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
})