import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AppState } from 'react-native';

import {
  akisLitreDakika,
  baslikKatsayi,
  golKapasitesi,
  type AkisId,
  type BaslikId,
  type GolId,
} from '@/constants/suSabitle';
import { bosDurum, depodanOku, depoyaYaz, type SuUygulamaDurum } from '@/context/suDepo';
import {
  ayAnahtari,
  ayDegistiMi,
  beklenenLimitLitre,
  gunSayisi,
  liderligeDahilMi,
  tasarrufYuzdesi,
} from '@/domain/aylikDongu';
import { saniyelikTuketim } from '@/domain/tuketim';

type Ctx = {
  yuklendi: boolean;
  durum: SuUygulamaDurum;
  gunSayisi: number;
  beklenenLimit: number;
  tasarrufYuzdesiHesap: number;
  liderlikUygun: boolean;
  anlikAkisLitreDk: number;
  anlikBaslikKatsayi: number;
  saniyelikTuketimHesap: number;
  onboardingBitir: (gol: GolId, akis: AkisId, baslik: BaslikId) => void;
  harcamaEkle: (litre: number) => void;
};

const SuCtx = createContext<Ctx | null>(null);

function migrate(d: SuUygulamaDurum): SuUygulamaDurum {
  const next = { ...d };
  if (next.sonIslemAyAnahtari == null) {
    next.sonIslemAyAnahtari = next.kayitTarihi
      ? ayAnahtari(new Date(next.kayitTarihi))
      : ayAnahtari(new Date());
  }
  return next;
}

/** Yeni ay: verileri sıfırla, Bu Ayki Başlangıç ekranına dön */
function ayBasiDurumu(simdikiAy: string): SuUygulamaDurum {
  return {
    ...bosDurum(),
    sonIslemAyAnahtari: simdikiAy,
  };
}

export function SuUygulamaSaglayici({ children }: { children: React.ReactNode }) {
  const [yuklendi, setYuklendi] = useState(false);
  const [durum, setDurum] = useState<SuUygulamaDurum>(bosDurum());

  useEffect(() => {
    let iptal = false;
    (async () => {
      const okunan = await depodanOku();
      if (iptal) return;
      let sonraki = okunan ? migrate(okunan) : bosDurum();
      const simdikiAy = ayAnahtari(new Date());
      if (ayDegistiMi(sonraki.sonIslemAyAnahtari, new Date())) {
        sonraki = ayBasiDurumu(simdikiAy);
      } else {
        sonraki = { ...sonraki, sonIslemAyAnahtari: simdikiAy };
      }
      setDurum(sonraki);
      await depoyaYaz(sonraki);
      setYuklendi(true);
    })();
    return () => {
      iptal = true;
    };
  }, []);

  /** Uygulama tekrar öne gelince ay değişimi kontrolü (ör. ay başı) */
  useEffect(() => {
    const abonelik = AppState.addEventListener('change', (durum) => {
      if (durum !== 'active') return;
      setDurum((prev) => {
        const bugun = new Date();
        const simdikiAy = ayAnahtari(bugun);
        if (ayDegistiMi(prev.sonIslemAyAnahtari, bugun)) {
          const next = ayBasiDurumu(simdikiAy);
          void depoyaYaz(next);
          return next;
        }
        if (prev.sonIslemAyAnahtari !== simdikiAy) {
          const next = { ...prev, sonIslemAyAnahtari: simdikiAy };
          void depoyaYaz(next);
          return next;
        }
        return prev;
      });
    });
    return () => abonelik.remove();
  }, []);

  const onboardingBitir = useCallback((gol: GolId, akis: AkisId, baslik: BaslikId) => {
    const bugun = new Date();
    const iso = bugun.toISOString();
    setDurum((prev) => {
      const next: SuUygulamaDurum = {
        ...prev,
        onboardingTamam: true,
        kayitTarihi: iso,
        secilenGol: gol,
        secilenAkis: akis,
        secilenBaslik: baslik,
        sonIslemAyAnahtari: ayAnahtari(bugun),
      };
      void depoyaYaz(next);
      return next;
    });
  }, []);

  const harcamaEkle = useCallback((litre: number) => {
    if (litre <= 0) return;
    setDurum((prev) => {
      const next = { ...prev, toplamHarcama: prev.toplamHarcama + litre };
      void depoyaYaz(next);
      return next;
    });
  }, []);

  const anlikAkisLitreDk = durum.secilenAkis ? akisLitreDakika(durum.secilenAkis) : 0;
  const anlikBaslikKatsayi = durum.secilenBaslik ? baslikKatsayi(durum.secilenBaslik) : 1;
  const saniyelikTuketimHesap = saniyelikTuketim(anlikAkisLitreDk, anlikBaslikKatsayi);

  const kap = durum.secilenGol ? golKapasitesi(durum.secilenGol) : 0;
  const gun = gunSayisi(durum.kayitTarihi);
  const beklenen = beklenenLimitLitre(kap, gun);
  const tasarruf = tasarrufYuzdesi(beklenen, durum.toplamHarcama);
  const liderlik = liderligeDahilMi(gun);

  const deger = useMemo(
    () => ({
      yuklendi,
      durum,
      gunSayisi: gun,
      beklenenLimit: beklenen,
      tasarrufYuzdesiHesap: tasarruf,
      liderlikUygun: liderlik,
      anlikAkisLitreDk,
      anlikBaslikKatsayi,
      saniyelikTuketimHesap,
      onboardingBitir,
      harcamaEkle,
    }),
    [
      yuklendi,
      durum,
      gun,
      beklenen,
      tasarruf,
      liderlik,
      anlikAkisLitreDk,
      anlikBaslikKatsayi,
      saniyelikTuketimHesap,
      onboardingBitir,
      harcamaEkle,
    ],
  );

  return <SuCtx.Provider value={deger}>{children}</SuCtx.Provider>;
}

export function useSuUygulama(): Ctx {
  const x = useContext(SuCtx);
  if (!x) throw new Error('SuUygulamaSaglayici gerekli');
  return x;
}
