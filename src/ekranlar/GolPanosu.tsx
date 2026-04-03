import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';

import { GOLLER, type GolId } from '@/constants/suSabitle';
import { useSuUygulama } from '@/context/SuUygulamaContext';
import { ayIcindeKalanGun } from '@/domain/aylikDongu';

type GolSeviye = 'col' | 'kuru' | 'cimen' | 'cicek' | 'agac' | 'hayvan';

/** 6 farklı sahne — her biri ayrı görsel (Unsplash, ağ gerekir) */
const SEVIYE_GORSEL: Record<GolSeviye, string> = {
  col: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=960&q=80',
  kuru: 'https://images.unsplash.com/photo-1614005216618-6a20b933c578?w=960&q=80',
  cimen: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=960&q=80',
  cicek: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=960&q=80',
  agac: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=960&q=80',
  hayvan: 'https://images.unsplash.com/photo-1504208434029-ea599e920ef7?w=960&q=80',
};

const SEVIYE_AD: Record<GolSeviye, string> = {
  col: 'Çöl',
  kuru: 'Kuru göl yatağı',
  cimen: 'Çimenli göl',
  cicek: 'Çiçekli göl',
  agac: 'Ağaçlı göl',
  hayvan: 'Hayvanlı göl',
};

const EPS = 1e-6;

function formatLitreGoster(litre: number): string {
  const y = Math.round(litre);
  if (y < 0) return `-${Math.abs(y).toLocaleString('tr-TR')} L`;
  return `${y.toLocaleString('tr-TR')} L`;
}

function seviyeHesapla(kalanHam: number, toplamSu: number): GolSeviye {
  if (kalanHam < -EPS) return 'col';
  if (toplamSu <= EPS) return 'kuru';
  if (kalanHam >= -EPS && kalanHam <= EPS) return 'kuru';
  const oran = kalanHam / toplamSu;
  if (oran > 0 && oran <= 0.1) return 'cimen';
  if (oran > 0.1 && oran <= 0.3) return 'cicek';
  if (oran > 0.3 && oran <= 0.6) return 'agac';
  return 'hayvan';
}

export default function GolPanosu() {
  const scheme = useColorScheme();
  const koyu = scheme === 'dark';

  const { durum } = useSuUygulama();
  const kalanTakvimGunu = ayIcindeKalanGun(new Date());

  const golId = durum.secilenGol as GolId | null;
  const gol = golId != null ? GOLLER.find((g) => g.id === golId) : undefined;

  // Bar/etiket tarafında "toplam" değerini ayın tamamına göre göster (1 aylık hedef).
  const aylikToplamSu = Math.max(0, gol?.kapasiteLitre ?? 0);
  const kalanHam = aylikToplamSu - durum.toplamHarcama;

  const seviye = useMemo(
    () => seviyeHesapla(kalanHam, aylikToplamSu),
    [kalanHam, aylikToplamSu],
  );
  const gorselUri = SEVIYE_GORSEL[seviye];

  /** Bar doluluk: negatif veya bitti → 0; fazla su yok (üst sınır 100%) */
  const barOran = aylikToplamSu > EPS ? Math.max(0, Math.min(1, kalanHam / aylikToplamSu)) : 0;
  const barYuzde = Math.round(barOran * 1000) / 10;

  const metin = koyu ? '#f2f6f8' : '#0d3d4d';
  const metin2 = koyu ? '#9eb8c4' : '#4a6b78';
  const kart = koyu ? '#1a2e36' : '#fff';
  const golAd = gol?.ad ?? 'Göl';
  const seviyeBaslik = SEVIYE_AD[seviye];

  const barZemin = koyu ? '#2a3238' : '#e6ecef';
  const barMavi = '#0a7ea4';
  /** Bar dar / boşken koyu yazı daha okunur */
  const barUstYazi = barOran < 0.12 ? metin : '#fff';

  return (
    <View style={[styles.kart, { backgroundColor: kart }]}>
      <View style={styles.gorselSarici}>
        <View style={[styles.gorselWrapper, { backgroundColor: '#1f2a30' }]}>
          <Image
            source={{ uri: gorselUri }}
            style={styles.gorsel}
            contentFit="cover"
            transition={220}
            accessibilityLabel={`${golAd} — ${seviyeBaslik}`}
          />
        </View>

        <View style={[styles.canBarDis, { backgroundColor: barZemin }]}>
          <View style={[styles.canBarIc, { width: `${barYuzde}%`, backgroundColor: barMavi }]} />
          <View style={styles.canBarYaziSar} pointerEvents="none">
            <Text style={[styles.canBarSol, { color: barUstYazi }]} numberOfLines={1}>
              {formatLitreGoster(kalanHam)}
            </Text>
            <Text style={[styles.canBarOrta, { color: barUstYazi }]} numberOfLines={1}>
              |
            </Text>
            <Text style={[styles.canBarSag, { color: barUstYazi }]} numberOfLines={1}>
              {formatLitreGoster(aylikToplamSu)}
            </Text>
          </View>
        </View>
      </View>

      <Text style={[styles.golAd, { color: metin }]}>{golAd}</Text>
      <Text style={[styles.seviyeEtiket, { color: metin2 }]}>{seviyeBaslik}</Text>
      <Text style={[styles.altAciklama, { color: metin2 }]}>
        Bu ayki toplam bütçeniz: {formatLitreGoster(aylikToplamSu)} · {kalanTakvimGunu} gün kaldı.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  kart: {
    marginHorizontal: 20,
    marginTop: 12,
    paddingBottom: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  gorselSarici: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  gorselWrapper: {
    width: '100%',
    aspectRatio: 1.35,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  gorsel: {
    ...StyleSheet.absoluteFillObject,
  },
  canBarDis: {
    width: '100%',
    height: 44,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  canBarIc: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    minWidth: 0,
  },
  canBarYaziSar: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    gap: 8,
  },
  canBarSol: { fontSize: 13, fontWeight: '800', flexShrink: 1, textShadowColor: 'rgba(0,0,0,0.35)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  canBarOrta: { fontSize: 13, fontWeight: '700', opacity: 0.85 },
  canBarSag: { fontSize: 13, fontWeight: '800', flexShrink: 1, textShadowColor: 'rgba(0,0,0,0.35)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  golAd: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: '700',
  },
  seviyeEtiket: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600',
  },
  altAciklama: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
