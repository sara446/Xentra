import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, font } from '../theme';

// error: mensaje que se muestra debajo del campo y pinta el borde en rojo.
export default function Input({ label, secure, style, error, editable = true, ...props }) {
  const [hidden, setHidden] = useState(!!secure);
  const [focused, setFocused] = useState(false);
  return (
    <View style={[styles.wrap, style]}>
      {label ? <Text style={[styles.label, error && { color: colors.danger }]}>{label}</Text> : null}
      <View style={[styles.box, focused && styles.boxFocused, error && styles.boxError, !editable && styles.boxDisabled]}>
        <TextInput
          placeholderTextColor="#A0A6BD"
          style={styles.input}
          secureTextEntry={hidden}
          autoCapitalize="none"
          editable={editable}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {error ? <Ionicons name="alert-circle" size={18} color={colors.danger} style={{ marginLeft: 6 }} /> : null}
        {secure ? (
          <TouchableOpacity onPress={() => setHidden(!hidden)} hitSlop={10} style={{ marginLeft: 6 }}>
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.muted} />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { ...font.small, color: colors.navy, fontWeight: '600', marginBottom: 6 },
  box: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 14, height: 48 },
  boxFocused: { borderColor: colors.navy, borderWidth: 1.5 },
  boxError: { borderColor: colors.danger, borderWidth: 1.5, backgroundColor: '#FFF8F7' },
  boxDisabled: { backgroundColor: colors.bg },
  input: { flex: 1, fontSize: 14, color: colors.navy, minWidth: 0 },
  error: { color: colors.danger, fontSize: 12, marginTop: 4, fontWeight: '600' },
});
