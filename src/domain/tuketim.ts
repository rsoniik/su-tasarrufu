/**
 * Saniyelik tüketim ve anlık harcama (litre).
 * SaniyelikTuketim = (AkışHızı_L/dk / 60) * Katsayı
 * AnlıkHarcama = GeçenSaniye * SaniyelikTuketim
 */

export function saniyelikTuketim(akisLitreDakika: number, baslikKatsayi: number): number {
  if (akisLitreDakika < 0 || baslikKatsayi < 0) return 0;
  return (akisLitreDakika / 60) * baslikKatsayi;
}

export function anlikHarcamaLitre(gecenSaniye: number, saniyelikTuketimL: number): number {
  if (gecenSaniye < 0 || saniyelikTuketimL < 0) return 0;
  return gecenSaniye * saniyelikTuketimL;
}
