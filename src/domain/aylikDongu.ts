/**
 * Aylık döngü: kayıt tarihi, takvim ayına göre gün sayısı, beklenen limit, tasarruf %, liderlik uygunluğu.
 */

const MS_GUN = 86400000;
/** Liderlik tablosu: en az bu kadar gün kullanılmış olmalı */
export const LIDERLIK_MIN_GUN = 3;

/** Verilen tarihin ayındaki toplam gün sayısı (28–31) */
export function takvimAyGunSayisi(tarih: Date = new Date()): number {
  const y = tarih.getFullYear();
  const m = tarih.getMonth();
  return new Date(y, m + 1, 0).getDate();
}

/**
 * Bu takvim ayında bugünden itibaren (bugün dahil) kaç gün kaldı.
 * Örn. 30 günlük ayın 3'ünde → 28.
 */
export function ayIcindeKalanGun(tarih: Date = new Date()): number {
  const son = takvimAyGunSayisi(tarih);
  const gun = tarih.getDate();
  return Math.max(0, son - gun + 1);
}

/** Kayıt gününden o ayın son gününe kadar (her iki gün dahil) kaç gün var */
function kayitAySonunaKadarGun(kayit: Date): number {
  const y = kayit.getFullYear();
  const m = kayit.getMonth();
  const aySonu = new Date(y, m + 1, 0);
  const k = gunBaslangici(kayit);
  const son = gunBaslangici(aySonu);
  return Math.floor((son.getTime() - k.getTime()) / MS_GUN) + 1;
}

/** YYYY-MM (aylık sıfırlama anahtarı) */
export function ayAnahtari(tarih: Date = new Date()): string {
  const y = tarih.getFullYear();
  const m = String(tarih.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function gunBaslangici(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/**
 * Gün sayısı: bugün − kayıt tarihi (aynı gün = 1), üst sınır kayıt ayında ay sonuna kadar geçen gün.
 * Aylar 28–31 gün olabilir; yeni ayda veri sıfırlandığı için normalde kayıt ile bugün aynı aydadır.
 */
export function gunSayisi(kayitTarihiISO: string | null, bugun: Date = new Date()): number {
  if (!kayitTarihiISO) return 0;
  const kayit = gunBaslangici(new Date(kayitTarihiISO));
  const b = gunBaslangici(bugun);
  if (Number.isNaN(kayit.getTime())) return 0;
  const farkGun = Math.floor((b.getTime() - kayit.getTime()) / MS_GUN);
  const ham = farkGun + 1;
  if (ham < 1) return 1;

  const ayniAy =
    kayit.getFullYear() === b.getFullYear() && kayit.getMonth() === b.getMonth();
  const tavan = ayniAy ? kayitAySonunaKadarGun(kayit) : takvimAyGunSayisi(b);

  return Math.min(Math.max(1, tavan), ham);
}

/**
 * BeklenenLimit = (GölKapasitesi / ayGünSayısı) * GünSayisi — ay uzunluğu takvime göre.
 */
export function beklenenLimitLitre(
  golKapasiteLitre: number,
  gunSayisiVal: number,
  bugun: Date = new Date(),
): number {
  if (golKapasiteLitre <= 0 || gunSayisiVal <= 0) return 0;
  const ayGun = takvimAyGunSayisi(bugun);
  if (ayGun <= 0) return 0;
  return (golKapasiteLitre / ayGun) * gunSayisiVal;
}

/**
 * TasarrufYüzdesi = ((BeklenenLimit - ToplamHarcama) / BeklenenLimit) * 100
 */
export function tasarrufYuzdesi(beklenenLimitL: number, toplamHarcamaL: number): number {
  if (beklenenLimitL <= 0) return 0;
  const ham = ((beklenenLimitL - toplamHarcamaL) / beklenenLimitL) * 100;
  return Math.round(ham * 10) / 10;
}

/**
 * Kural: GünSayisi < 3 → liderlik dışı
 */
export function liderligeDahilMi(gunSayisiVal: number): boolean {
  if (gunSayisiVal < LIDERLIK_MIN_GUN) {
    return false;
  }
  return true;
}

/**
 * Takvim ayı değişti mi? (Yeni ayda veri sıfırlama + Bu Ayki Başlangıç)
 * İlk kurulumda kayıtlı ay yoksa false — yanlışlıkla sıfırlama yapılmaz.
 */
export function ayDegistiMi(kayitliAyAnahtari: string | null, bugun: Date = new Date()): boolean {
  if (kayitliAyAnahtari === null) return false;
  return kayitliAyAnahtari !== ayAnahtari(bugun);
}
