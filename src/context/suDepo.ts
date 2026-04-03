import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AkisId, BaslikId, GolId } from '@/constants/suSabitle';

const ANAHTAR = 'su_tasarrufu_durum_v1';

export type SuUygulamaDurum = {
  /** Bu aylık döngüde onboarding bitti mi */
  onboardingTamam: boolean;
  /** ISO — bu ay içinde sayım başlangıcı (onboarding tamamlanınca set) */
  kayitTarihi: string | null;
  /** Seçilen göl / akış / başlık */
  secilenGol: GolId | null;
  secilenAkis: AkisId | null;
  secilenBaslik: BaslikId | null;
  /** Ay içi toplam harcama (litre) */
  toplamHarcama: number;
  /** Son işlenen ay YYYY-MM — ay değişince sıfırlama */
  sonIslemAyAnahtari: string | null;
};

export const bosDurum = (): SuUygulamaDurum => ({
  onboardingTamam: false,
  kayitTarihi: null,
  secilenGol: null,
  secilenAkis: null,
  secilenBaslik: null,
  toplamHarcama: 0,
  sonIslemAyAnahtari: null,
});

export async function depodanOku(): Promise<SuUygulamaDurum | null> {
  try {
    const ham = await AsyncStorage.getItem(ANAHTAR);
    if (!ham) return null;
    return JSON.parse(ham) as SuUygulamaDurum;
  } catch {
    return null;
  }
}

export async function depoyaYaz(durum: SuUygulamaDurum): Promise<void> {
  await AsyncStorage.setItem(ANAHTAR, JSON.stringify(durum));
}
