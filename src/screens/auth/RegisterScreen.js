import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Screen from '../../components/Screen';
import ScreenHeader from '../../components/ScreenHeader';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';
import { useModal } from '../../components/AppModal';
import AuthController from '../../controllers/AuthController';
import { ROLES } from '../../models/User';
import { validateRegister, hasErrors } from '../../utils/validators';
import { ROUTES } from '../../navigation/routeNames';
import { colors, font } from '../../theme';

// Se usa desde Login (auto-registro) y desde Gestión de usuarios (route.params.fromAdmin).
export default function RegisterScreen({ navigation, route }) {
  const fromAdmin = !!route.params?.fromAdmin;
  const showModal = useModal();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: fromAdmin ? ROLES[1] : ROLES[0] });
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
      await AuthController.register(form);
      showModal({
        type: 'success',
        title: fromAdmin ? 'Usuario creado' : 'Cuenta creada',
        message: fromAdmin ? `${form.name} ya puede iniciar sesión en Xentra.` : 'Tu cuenta se creó correctamente. Ya puedes iniciar sesión.',
        confirmText: 'Continuar',
        onClose: () => (fromAdmin ? navigation.goBack() : navigation.navigate(ROUTES.LOGIN)),
      });
    } catch (err) {
      // Error del controlador (ej. correo ya registrado): se marca en el campo correspondiente.
      if (/correo/i.test(err.message)) setErrors({ email: err.message });
      else showModal({ type: 'error', title: 'No se pudo crear la cuenta', message: err.message });
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
      <Input label="Correo electrónico" value={form.email} onChangeText={set('email')} placeholder="juan.perez@correo.com" keyboardType="email-address" error={errors.email} />
      <Input label="Contraseña" value={form.password} onChangeText={set('password')} placeholder="Mínimo 6 caracteres" secure error={errors.password} />
      <Input label="Confirmar contraseña" value={form.confirm} onChangeText={set('confirm')} placeholder="Repite la contraseña" secure error={errors.confirm} />
      <Select label="Rol" value={form.role} onChange={set('role')} options={ROLES.map((r) => ({ value: r, label: r }))} />
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
});
