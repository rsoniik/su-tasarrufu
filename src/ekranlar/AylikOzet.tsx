import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { GOLLER } from '@/constants/suSabitle';
import { LIDERLIK_MIN_GUN } from '@/domain/aylikDongu';
import { useSuUygulama } from '@/context/SuUygulamaContext';

/** Geliştirme / test: örnek harcama ekle */
const DEMO_LITRE = 25;

export default function AylikOzet() {
  const scheme = useColorScheme();
  const koyu = scheme === 'dark';
  const metin = koyu ? '#fff' : '#111';
  const metin2 = koyu ? '#a8a8a8' : '#666';
  const kutu = koyu ? '#2c2c2e' : '#f2f2f7';

  const {
    durum,
    gunSayisi: gun,
    beklenenLimit,
    tasarrufYuzdesiHesap,
    liderlikUygun,
    saniyelikTuketimHesap,
    harcamaEkle,
  } = useSuUygulama();

  const golAd =
    durum.secilenGol != null ? GOLLER.find((g) => g.id === durum.secilenGol)?.ad ?? '—' : '—';

  return (
    <ScrollView
      contentContainerStyle={styles.ic}
      showsVerticalScrollIndicator={false}>
      <Text style={[styles.baslik, { color: metin }]}>Bu ay özeti</Text>
      <Text style={[styles.alt, { color: metin2 }]}>
        Kayıt tarihinden bugüne göre beklenen limit ve tasarruf yüzdesi hesaplanır.
      </Text>

      <View style={[styles.kutu, { backgroundColor: kutu }]}>
        <Satir etiket="Hedef göl" deger={golAd} metin={metin} metin2={metin2} />
        <Satir
          etiket="Kayıt tarihi"
          deger={
            durum.kayitTarihi
              ? new Date(durum.kayitTarihi).toLocaleDateString('tr-TR')
              : '—'
          }
          metin={metin}
          metin2={metin2}
        />
        <Satir etiket="Takip günü (bu ay)" deger={`${gun}`} metin={metin} metin2={metin2} />
        <Satir
          etiket="Beklenen limit (bu güne kadar)"
          deger={`${Math.round(beklenenLimit).toLocaleString('tr-TR')} L`}
          metin={metin}
          metin2={metin2}
        />
        <Satir
          etiket="Toplam harcama"
          deger={`${durum.toplamHarcama.toLocaleString('tr-TR', { maximumFractionDigits: 1 })} L`}
          metin={metin}
          metin2={metin2}
        />
        <Satir
          etiket="Tasarruf yüzdesi"
          deger={`%${tasarrufYuzdesiHesap}`}
          metin={metin}
          metin2={metin2}
        />
        <Satir
          etiket="Saniyelik tüketim (anlık)"
          deger={`${saniyelikTuketimHesap.toLocaleString('tr-TR', { maximumSignificantDigits: 4 })} L/sn`}
          metin={metin}
          metin2={metin2}
        />
        <Text style={[styles.kural, { color: metin2 }]}>
          Liderlik: {liderlikUygun ? 'Uygun (≥ ' + LIDERLIK_MIN_GUN + ' gün)' : `Dışı (gün < ${LIDERLIK_MIN_GUN})`}
        </Text>
      </View>

      <Pressable
        onPress={() => harcamaEkle(DEMO_LITRE)}
        style={({ pressed }) => [
          styles.demo,
          { backgroundColor: koyu ? '#3a3a3c' : '#e5e5ea', opacity: pressed ? 0.85 : 1 },
        ]}>
        <Text style={{ color: metin, fontWeight: '600' }}>
          Demo: +{DEMO_LITRE} L harcama ekle (mantığı dene)
        </Text>
      </Pressable>
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
    <View style={styles.satir}>
      <Text style={[styles.etiket, { color: metin2 }]}>{etiket}</Text>
      <Text style={[styles.deger, { color: metin }]}>{deger}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ic: { padding: 20, paddingBottom: 40, gap: 12 },
  baslik: { fontSize: 24, fontWeight: '700' },
  alt: { fontSize: 14, lineHeight: 20 },
  kutu: { borderRadius: 16, padding: 16, gap: 12 },
  satir: { gap: 2 },
  etiket: { fontSize: 12 },
  deger: { fontSize: 16, fontWeight: '600' },
  kural: { fontSize: 13, marginTop: 4 },
  demo: { padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
});
