import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';

const VARIANTS = {
  primary: { bg: colors.navy, fg: colors.white, border: colors.navy },
  accent: { bg: colors.accent, fg: colors.navy, border: colors.accent },
  outline: { bg: colors.white, fg: colors.navy, border: colors.navy },
  danger: { bg: colors.white, fg: colors.danger, border: colors.danger },
  dangerFilled: { bg: colors.danger, fg: colors.white, border: colors.danger },
};

export default function Button({ title, onPress, variant = 'primary', loading, disabled, style }) {
  const v = VARIANTS[variant];
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.btn, { backgroundColor: v.bg, borderColor: v.border }, disabled && { opacity: 0.5 }, style]}
    >
      {loading ? <ActivityIndicator color={v.fg} /> : <Text style={[styles.text, { color: v.fg }]}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { height: 48, borderRadius: radius.md, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  text: { fontSize: 15, fontWeight: '700' },
});
