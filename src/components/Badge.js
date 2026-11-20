import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';

const TONES = {
  normal: { bg: colors.successBg, fg: colors.success },
  low: { bg: colors.warningBg, fg: '#B7791F' },
  critical: { bg: colors.dangerBg, fg: colors.danger },
  active: { bg: colors.successBg, fg: colors.success },
  inactive: { bg: colors.dangerBg, fg: colors.danger },
};

export default function Badge({ tone = 'normal', label }) {
  const t = TONES[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }]}>
      <Text style={[styles.text, { color: t.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill },
  text: { fontSize: 11, fontWeight: '700' },
});
