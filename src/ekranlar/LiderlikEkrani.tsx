import React from 'react';
import { ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { LIDERLIK_MIN_GUN } from '@/domain/aylikDongu';
import { useSuUygulama } from '@/context/SuUygulamaContext';

export default function LiderlikEkrani() {
  const scheme = useColorScheme();
  const koyu = scheme === 'dark';

  const { liderlikUygun, gunSayisi: gun, tasarrufYuzdesiHesap } = useSuUygulama();

  const arka = koyu ? '#0f1a1f' : '#bfe5f2';
  const metin = koyu ? '#f2f6f8' : '#0d3d4d';
  const metin2 = koyu ? '#9eb8c4' : '#4a6b78';
  const kart = koyu ? '#1a2e36' : '#fff';

  return (
    <ScrollView
      style={[styles.kok, { backgroundColor: arka }]}
      contentContainerStyle={styles.ic}
      showsVerticalScrollIndicator={false}>
      <Text style={[styles.baslik, { color: metin }]}>Liderlik</Text>
      <Text style={[styles.alt, { color: metin2 }]}>
        Tablo yakında: şimdilik kendi durumunu burada görebilirsin.
      </Text>

      <View style={[styles.kutu, { backgroundColor: kart }]}>
        <Satir etiket="Bu ay tasarrufunuz" deger={`%${tasarrufYuzdesiHesap}`} metin={metin} metin2={metin2} />
        <Satir etiket="Kullanım günü" deger={`${gun} gün`} metin={metin} metin2={metin2} />
        <Satir
          etiket="Liderlik durumu"
          deger={
            liderlikUygun
              ? `Uygun (≥ ${LIDERLIK_MIN_GUN} gün)`
              : `Henüz değil (< ${LIDERLIK_MIN_GUN} gün)`
          }
          metin={metin}
          metin2={metin2}
        />
      </View>
    </ScrollView>
  );
}

function Satir({
  etiket,
  deger,
  metin,
  metin2,
}: {
  etiket: string;
  deger: string;
  metin: string;
  metin2: string;
}) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={{ fontSize: 12, color: metin2 }}>{etiket}</Text>
      <Text style={{ fontSize: 17, fontWeight: '600', color: metin }}>{deger}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  kok: { flex: 1 },
  ic: { padding: 20, paddingBottom: 40, gap: 14 },
  baslik: { fontSize: 24, fontWeight: '700' },
  alt: { fontSize: 14, lineHeight: 20 },
  kutu: { borderRadius: 16, padding: 18, gap: 16 },
});
