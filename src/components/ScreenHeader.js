import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, spacing } from '../theme';

export default function ScreenHeader({ title, onBack, right }) {
  return (
    <View style={styles.row}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.back} hitSlop={10}>
          <Ionicons name="chevron-back" size={22} color={colors.navy} />
        </TouchableOpacity>
      ) : null}
      <Text style={[font.h2, styles.title]} numberOfLines={1}>{title}</Text>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg, minHeight: 36 },
  back: { marginRight: spacing.sm },
  title: { flex: 1 },
  right: { flexDirection: 'row', alignItems: 'center' },
});
