/** Aylık hedef göller (litre) ve akış / başlık sabitleri — tamamı Türkçe etiketlerle */

export type GolId = 'kucuk' | 'orta' | 'buyuk';
export type AkisId = 'az' | 'orta' | 'cok';
export type BaslikId = 'normal' | 'tasarruflu';

export type GolTanim = { id: GolId; ad: string; kapasiteLitre: number; aciklama: string };
export type AkisTanim = { id: AkisId; ad: string; litreDakika: number };
export type BaslikTanim = { id: BaslikId; ad: string; katsayi: number };

export const GOLLER: GolTanim[] = [
  { id: 'kucuk', ad: 'Küçük Göl', kapasiteLitre: 1500, aciklama: 'Yüksek tasarruf hedefi' },
  { id: 'orta', ad: 'Orta Göl', kapasiteLitre: 3000, aciklama: 'Ortalama tüketim' },
  { id: 'buyuk', ad: 'Büyük Göl', kapasiteLitre: 5000, aciklama: 'Esnek tüketim' },
];

export const AKIS_HIZLARI: AkisTanim[] = [
  { id: 'az', ad: 'Az', litreDakika: 5 },
  { id: 'orta', ad: 'Orta', litreDakika: 10 },
  { id: 'cok', ad: 'Çok', litreDakika: 15 },
];

/** Başlık katsayısı: Normal 1.0, Tasarruflu 0.6 */
export const BASLIK_KATSAYILARI: BaslikTanim[] = [
  { id: 'normal', ad: 'Normal', katsayi: 1.0 },
  { id: 'tasarruflu', ad: 'Tasarruflu', katsayi: 0.6 },
];

export function golKapasitesi(id: GolId): number {
  return GOLLER.find((g) => g.id === id)?.kapasiteLitre ?? 0;
}

export function akisLitreDakika(id: AkisId): number {
  return AKIS_HIZLARI.find((a) => a.id === id)?.litreDakika ?? 0;
}

export function baslikKatsayi(id: BaslikId): number {
  return BASLIK_KATSAYILARI.find((b) => b.id === id)?.katsayi ?? 1;
}
