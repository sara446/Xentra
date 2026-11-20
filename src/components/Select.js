import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, font } from '../theme';

// options: [{ value, label }]
export default function Select({ label, value, options, onChange, style, error }) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);
  return (
    <View style={[{ marginBottom: 14 }, style]}>
      {label ? <Text style={[styles.label, error && { color: colors.danger }]}>{label}</Text> : null}
      <TouchableOpacity style={[styles.box, error && styles.boxError]} onPress={() => setOpen(true)} activeOpacity={0.8}>
        <Text style={styles.value} numberOfLines={1}>{current?.label ?? 'Seleccionar'}</Text>
        <Ionicons name="chevron-down" size={18} color={colors.muted} />
      </TouchableOpacity>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <FlatList
              data={options}
              keyExtractor={(o) => String(o.value)}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.option} onPress={() => { onChange(item.value); setOpen(false); }}>
                  <Text style={[styles.optionText, item.value === value && { fontWeight: '800' }]}>{item.label}</Text>
                  {item.value === value ? <Ionicons name="checkmark" size={18} color={colors.navy} /> : null}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...font.small, color: colors.navy, fontWeight: '600', marginBottom: 6 },
  box: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 14, height: 48 },
  boxError: { borderColor: colors.danger, borderWidth: 1.5 },
  error: { color: colors.danger, fontSize: 12, marginTop: 4, fontWeight: '600' },
  value: { flex: 1, fontSize: 14, color: colors.navy },
  backdrop: { flex: 1, backgroundColor: 'rgba(11,27,75,0.5)', justifyContent: 'center', padding: 24 },
  sheet: { backgroundColor: colors.white, borderRadius: radius.lg, maxHeight: '60%', paddingVertical: 6 },
  option: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 18 },
  optionText: { fontSize: 15, color: colors.navy },
});
