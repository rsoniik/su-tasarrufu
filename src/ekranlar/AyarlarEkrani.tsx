import React from 'react';
import { ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';

export default function AyarlarEkrani() {
  const scheme = useColorScheme();
  const koyu = scheme === 'dark';

  const arka = koyu ? '#0f1a1f' : '#bfe5f2';
  const metin = koyu ? '#f2f6f8' : '#0d3d4d';
  const metin2 = koyu ? '#9eb8c4' : '#4a6b78';
  const kart = koyu ? '#1a2e36' : '#fff';

  return (
    <ScrollView
      style={[styles.kok, { backgroundColor: arka }]}
      contentContainerStyle={styles.ic}
      showsVerticalScrollIndicator={false}>
      <Text style={[styles.baslik, { color: metin }]}>Ayarlar</Text>
      <Text style={[styles.alt, { color: metin2 }]}>
        Bildirimler, birimler ve hesap seçenekleri burada toplanacak.
      </Text>
      <View style={[styles.kutu, { backgroundColor: kart }]}>
        <Text style={[styles.yakinda, { color: metin2 }]}>Yakında</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  kok: { flex: 1 },
  ic: { padding: 20, paddingBottom: 40, gap: 14 },
  baslik: { fontSize: 24, fontWeight: '700' },
  alt: { fontSize: 14, lineHeight: 20 },
  kutu: { borderRadius: 16, padding: 20, minHeight: 100, justifyContent: 'center' },
  yakinda: { fontSize: 15 },
});
