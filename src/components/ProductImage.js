import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';

export default function ProductImage({ uri, size = 56, rounded = radius.md, style }) {
  const [failed, setFailed] = useState(false);
  const box = { width: size, height: size, borderRadius: rounded };
  if (!uri || failed) {
    return (
      <View style={[styles.fallback, box, style]}>
        <Ionicons name="cube-outline" size={size * 0.45} color={colors.muted} />
      </View>
    );
  }
  return <Image source={{ uri }} style={[box, styles.img, style]} onError={() => setFailed(true)} resizeMode="cover" />;
}

const styles = StyleSheet.create({
  img: { backgroundColor: colors.border },
  fallback: { backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
});
