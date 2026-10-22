import React, { createContext, useCallback, useContext, useState } from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';
import { colors, radius, font } from '../theme';

// Modal propio para confirmaciones, éxitos y errores.
// Se usa en lugar de Alert.alert porque Alert no funciona en la versión web.
const ModalContext = createContext(() => {});

const TYPES = {
  success: { icon: 'checkmark-circle', color: colors.success, bg: colors.successBg },
  error: { icon: 'close-circle', color: colors.danger, bg: colors.dangerBg },
  confirm: { icon: 'trash-outline', color: colors.danger, bg: colors.dangerBg },
  info: { icon: 'information-circle', color: colors.navy, bg: colors.warningBg },
};

export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null);

  // showModal({ type, title, message, confirmText, cancelText, onConfirm, onClose })
  const showModal = useCallback((options) => setModal(options), []);

  const close = (cb) => {
    setModal(null);
    if (cb) cb();
  };

  const t = TYPES[modal?.type ?? 'info'];
  const isConfirm = modal?.type === 'confirm';

  return (
    <ModalContext.Provider value={showModal}>
      {children}
      <Modal visible={!!modal} transparent animationType="fade" onRequestClose={() => close(modal?.onClose)}>
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <View style={[styles.iconWrap, { backgroundColor: t.bg }]}>
              <Ionicons name={t.icon} size={34} color={t.color} />
            </View>
            <Text style={[font.h2, styles.title]}>{modal?.title}</Text>
            {modal?.message ? <Text style={styles.message}>{modal.message}</Text> : null}
            {isConfirm ? (
              <View style={styles.row}>
                <Button title={modal?.cancelText ?? 'Cancelar'} variant="outline" style={{ flex: 1 }} onPress={() => close(modal?.onClose)} />
                <Button title={modal?.confirmText ?? 'Eliminar'} variant="dangerFilled" style={{ flex: 1 }} onPress={() => close(modal?.onConfirm)} />
              </View>
            ) : (
              <Button
                title={modal?.confirmText ?? 'Aceptar'}
                variant={modal?.type === 'error' ? 'outline' : 'primary'}
                style={{ alignSelf: 'stretch', marginTop: 4 }}
                onPress={() => close(modal?.onClose)}
              />
            )}
          </View>
        </View>
      </Modal>
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(11,27,75,0.55)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 360, backgroundColor: colors.white, borderRadius: radius.lg, padding: 22, alignItems: 'center' },
  iconWrap: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  title: { textAlign: 'center', marginBottom: 6 },
  message: { fontSize: 14, color: colors.muted, textAlign: 'center', marginBottom: 18, lineHeight: 20 },
  row: { flexDirection: 'row', gap: 12, alignSelf: 'stretch' },
});
