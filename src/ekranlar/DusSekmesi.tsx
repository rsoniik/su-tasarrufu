import React from 'react';
import { ScrollView, StyleSheet, useColorScheme } from 'react-native';

import DusKronometre from '@/ekranlar/DusKronometre';
import GolPanosu from '@/ekranlar/GolPanosu';

export default function DusSekmesi() {
  const scheme = useColorScheme();
  const arka = scheme === 'dark' ? '#0f1a1f' : '#bfe5f2';

  return (
    <ScrollView
      style={[styles.kok, { backgroundColor: arka }]}
      contentContainerStyle={styles.ic}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      <GolPanosu />
      <DusKronometre />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  kok: { flex: 1 },
  ic: { paddingBottom: 28 },
});
