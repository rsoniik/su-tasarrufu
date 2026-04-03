# Su tasarrufu için geliştirdiğimiz projeye hoşgeldiniz 👋

Uygulamamız, su tüketimini, özellikle duş esnasında harcanan su miktarını, sadece bir rakam olmaktan çıkarıp kişiselleştirilmiş bir "ekosistem yönetimine" dönüştüren, React Native [Expo](https://expo.dev) ile geliştirilmiş bir mobil uygulamadır.

## 🚀 Projenin Amacı
Geleneksel su tasarrufu uygulamalarının aksine, bu proje kullanıcının duş başlığı tipi ve su akış hızı gibi teknik verilerini kullanarak gerçek zamanlı bir tüketim analizi yapar. Kullanıcı, seçtiği bir gölü (Küçük, Orta, Büyük) kendi su bütçesi olarak belirler ve harcamalarıyla bu gölün ekolojik dengesini korumaya çalışır.

## 🛠️ Projenin nasıl çalıştığına dair
Uygulama arka planda lineer bir tüketim modeli yerine, kullanıcı spesifikasyonlarına dayalı dinamik bir hesaplama motoru kullanır.

### Dinamik Debi Hesabı
  Saniyelik Tüketim Mantığı: Su akış hızı ve başlık katsayısı kullanılarak saniyelik tüketimi hesaplama
   ```bash
   // @/domain/tuketim.ts

export function saniyelikTuketim(akisLitreDakika: number, baslikKatsayi: number): number {
  if (akisLitreDakika < 0 || baslikKatsayi < 0) return 0;
  return (akisLitreDakika / 60) * baslikKatsayi;
}
   ```
   
### Context API
Harcamaların kaydedilmesi ve global state'in güncellenmesi

```bash
   // @/domain/SuUygulamaContext.tsx

   const harcamaEkle = useCallback((litre: number) => {
    if (litre <= 0) return;
    setDurum((prev) => {
      const next = { ...prev, toplamHarcama: prev.toplamHarcama + litre };
      void depoyaYaz(next);
      return next;
    });
  }, []);
   ```
### Göl Metaforu 
Toplam su kapasitesi, görsel bir "kuruma" algoritması ile UI'a yansıtılır. Görsellerin hepsi elle çizildi!

```bash
   // @/ekranlar/GolPanosu.tsx

const SEVIYE_GORSEL: Record<GolSeviye, number> = {
  col: require('../../assets_gol/1.png'),
  kuru: require('../../assets_gol/2.png'),
  cimen: require('../../assets_gol/3.png'),
  cicek: require('../../assets_gol/4.png'),
  agac: require('../../assets_gol/5.png'),
  hayvan: require('../../assets_gol/6.png'),
};
   ```
## 📦 Kurulum (Hesap açma gerektirmez)
Projeyi yerelinizde çalıştırmak için:

- Dosyaları indirin:
[su_tasarrufu_v1.zip](https://github.com/rsoniik/su-tasarrufu/archive/refs/heads/main.zip)
- İndirdiğiniz dosyayı klasöre çıkarın. 
  
- Bağımlılıkları yükleyin (terminal üzerinden):
   ```bash   
   npm install
   ```
- Uygulamayı başlatın (terminal üzerinden):
  ```bash
   npx expo start
   ```
- Telefonununuza [Expo Go](https://expo.dev/go) uygulamasının son sürümünü indirin (minimum sürüm SDK 55 olmalı).
- Ekranda çıkan QR kodu telefonunuzdaki Expo Go uygulaması üzerinden okutun.
- Hazırsınız!
