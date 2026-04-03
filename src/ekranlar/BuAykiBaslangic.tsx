import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  AKIS_HIZLARI,
  BASLIK_KATSAYILARI,
  GOLLER,
  type AkisId,
  type BaslikId,
  type GolId,
} from '@/constants/suSabitle';
import { useSuUygulama } from '@/context/SuUygulamaContext';

export default function BuAykiBaslangic() {
  const scheme = useColorScheme();
  const koyu = scheme === 'dark';
  const metin = koyu ? '#fff' : '#111';
  const metin2 = koyu ? '#b0b0b0' : '#555';
  const zemin2 = koyu ? '#2c2c2e' : '#f0f0f2';
  const kenar = koyu ? '#444' : '#ddd';

  const { onboardingBitir } = useSuUygulama();
  const [gol, setGol] = useState<GolId>('orta');
  const [akis, setAkis] = useState<AkisId>('orta');
  const [baslik, setBaslik] = useState<BaslikId>('normal');

  return (
    <ScrollView
      contentContainerStyle={styles.ic}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      <Text style={[styles.baslik, { color: metin }]}>Bu Ayki Başlangıcın</Text>
      <Text style={[styles.aciklama, { color: metin2 }]}>
        Bu ay için hedef gölünü, akış hızını ve başlık katsayısını seç. Ay değişince bu ekran yeniden
        açılır.
      </Text>

      <Text style={[styles.bolum, { color: metin }]}>Hedef göl</Text>
      <View style={styles.sutun}>
        {GOLLER.map((g) => {
          const secili = gol === g.id;
          return (
            <Pressable
              key={g.id}
              onPress={() => setGol(g.id)}
              style={({ pressed }) => [
                styles.chip,
                {
                  borderColor: secili ? '#1E88E5' : kenar,
                  backgroundColor: secili ? 'rgba(30,136,229,0.15)' : zemin2,
                  opacity: pressed ? 0.88 : 1,
                },
              ]}>
              <Text style={[styles.chipMetin, { color: secili ? '#1565C0' : metin }]}>
                {g.ad} — {g.kapasiteLitre.toLocaleString('tr-TR')} L ({g.aciklama})
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.bolum, { color: metin }]}>Akış hızı</Text>
      <View style={styles.yatay}>
        {AKIS_HIZLARI.map((a) => {
          const secili = akis === a.id;
          return (
            <Pressable
              key={a.id}
              onPress={() => setAkis(a.id)}
              style={({ pressed }) => [
                styles.chipK,
                {
                  borderColor: secili ? '#1E88E5' : kenar,
                  backgroundColor: secili ? 'rgba(30,136,229,0.15)' : zemin2,
                  opacity: pressed ? 0.88 : 1,
                },
              ]}>
              <Text style={[styles.chipMetin, { color: secili ? '#1565C0' : metin }]}>
                {a.ad} ({a.litreDakika} L/dk)
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.bolum, { color: metin }]}>Başlık katsayısı</Text>
      <View style={styles.yatay}>
        {BASLIK_KATSAYILARI.map((b) => {
          const secili = baslik === b.id;
          return (
            <Pressable
              key={b.id}
              onPress={() => setBaslik(b.id)}
              style={({ pressed }) => [
                styles.chipK,
                {
                  borderColor: secili ? '#1E88E5' : kenar,
                  backgroundColor: secili ? 'rgba(30,136,229,0.15)' : zemin2,
                  opacity: pressed ? 0.88 : 1,
                },
              ]}>
              <Text style={[styles.chipMetin, { color: secili ? '#1565C0' : metin }]}>
                {b.ad} (×{b.katsayi})
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={() => onboardingBitir(gol, akis, baslik)}
        style={({ pressed }) => [styles.cta, { opacity: pressed ? 0.9 : 1 }]}>
        <Text style={styles.ctaMetin}>Kaydet ve devam et</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ic: { padding: 20, paddingBottom: 48, gap: 10 },
  baslik: { fontSize: 26, fontWeight: '700' },
  aciklama: { fontSize: 15, lineHeight: 22 },
  bolum: { fontSize: 17, fontWeight: '600', marginTop: 8 },
  sutun: { gap: 8 },
  yatay: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderRadius: 12, padding: 14 },
  chipK: { borderWidth: 1, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14 },
  chipMetin: { fontSize: 14, lineHeight: 20 },
  cta: {
    marginTop: 20,
    backgroundColor: '#1E88E5',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  ctaMetin: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
