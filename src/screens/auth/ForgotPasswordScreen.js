import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Screen from '../../components/Screen';
import ScreenHeader from '../../components/ScreenHeader';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useModal } from '../../components/AppModal';
import AuthController from '../../controllers/AuthController';
import { validateForgot, hasErrors } from '../../utils/validators';
import { ROUTES } from '../../navigation/routeNames';
import { colors, font } from '../../theme';

export default function ForgotPasswordScreen({ navigation }) {
  const showModal = useModal();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const onSend = async () => {
    const e = validateForgot({ email });
    setErrors(e);
    if (hasErrors(e)) return;
    setLoading(true);
    try {
      await AuthController.recoverPassword(email);
      showModal({
        type: 'success',
        title: 'Enlace enviado',
        message: `Enviamos un enlace de restablecimiento a ${email.trim()}. Revisa tu bandeja de entrada.`,
        confirmText: 'Volver al inicio de sesión',
        onClose: () => navigation.goBack(),
      });
    } catch (err) {
      setErrors({ email: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <ScreenHeader title="Recuperar contraseña" onBack={() => navigation.goBack()} />
      <Text style={font.title}>¿Olvidaste tu contraseña?</Text>
      <Text style={[font.small, { marginBottom: 20, marginTop: 4 }]}>Introduce tu correo electrónico para enviarte un enlace de restablecimiento.</Text>
      <Input
        label="Correo electrónico"
        value={email}
        onChangeText={(v) => { setEmail(v); if (errors.email) setErrors({}); }}
        placeholder="juan.perez@correo.com"
        keyboardType="email-address"
        error={errors.email}
      />
      <Button title="Enviar enlace" onPress={onSend} loading={loading} />
      <View style={styles.footer}>
        <Text style={font.small}>¿Ya tienes una cuenta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate(ROUTES.LOGIN)}>
          <Text style={styles.link}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  link: { color: colors.navy, fontWeight: '700', fontSize: 12 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 40 },
});
