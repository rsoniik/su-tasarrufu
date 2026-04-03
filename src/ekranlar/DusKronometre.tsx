import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { useSuUygulama } from '@/context/SuUygulamaContext';

const DAKIKA_SECENEKLERI = [5, 7, 10, 12, 15, 20, 30];

function sureMetni(sn: number): string {
  const m = Math.floor(sn / 60);
  const s = sn % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function sureOkunur(sn: number): string {
  const m = Math.floor(sn / 60);
  const s = sn % 60;
  if (m <= 0) return `${s} sn`;
  if (s === 0) return `${m} dk`;
  return `${m} dk ${s} sn`;
}

export default function DusKronometre() {
  const scheme = useColorScheme();
  const koyu = scheme === 'dark';
  const { saniyelikTuketimHesap, harcamaEkle } = useSuUygulama();

  const [secilenDakika, setSecilenDakika] = useState(10);
  /** Oturum başında sabitlenen toplam süre (sn) */
  const [planlananSn, setPlanlananSn] = useState(0);
  const [kalanSn, setKalanSn] = useState(0);
  /** Plan biten saniyeden sonra (süre aşımı) */
  const [asimSn, setAsimSn] = useState(0);
  const [calisiyor, setCalisiyor] = useState(false);
  const [tebrik, setTebrik] = useState<{ erkenKalanSn: number; litre: number } | null>(null);
  const [asimOzeti, setAsimOzeti] = useState<{ asimSn: number; litre: number } | null>(null);

  useEffect(() => {
    if (!calisiyor) return;

    const id = setInterval(() => {
      setKalanSn((prevKalan) => {
        if (prevKalan > 0) return prevKalan - 1;
        setAsimSn((a) => a + 1);
        return 0;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [calisiyor]);

  const oturumda = planlananSn > 0;
  const asimda = oturumda && kalanSn <= 0;

  const gecenSn = oturumda
    ? kalanSn > 0
      ? planlananSn - kalanSn
      : planlananSn + asimSn
    : 0;

  const tahminiLitreSuAn = gecenSn * saniyelikTuketimHesap;

  const zemin = koyu ? '#1a2e36' : '#fff';
  const metin = koyu ? '#f2f6f8' : '#0d3d4d';
  const metin2 = koyu ? '#9eb8c4' : '#4a6b78';
  const birincil = '#0a7ea4';
  const asimRenk = '#c45c26';
  const ikincil = koyu ? '#2a3f48' : '#e3f4f9';
  const seciliCip = koyu ? '#2a4558' : '#d0ebf5';

  const baslatVeyaDuraklat = () => {
    if (!oturumda) {
      const sn = secilenDakika * 60;
      setPlanlananSn(sn);
      setKalanSn(sn);
      setAsimSn(0);
      setCalisiyor(true);
      return;
    }
    setCalisiyor((c) => !c);
  };

  const sifirla = () => {
    setCalisiyor(false);
    setPlanlananSn(0);
    setKalanSn(0);
    setAsimSn(0);
  };

  /** Harcama: planı erken bitirirsen geçen süre; sürede bitirirsen plan + aşım. */
  const dusuBitirdim = () => {
    if (!oturumda) return;
    const kalanKayit = kalanSn;
    const asimKayit = asimSn;
    const gecen =
      kalanKayit > 0 ? planlananSn - kalanKayit : planlananSn + asimKayit;
    if (gecen <= 0) return;

    const litre = gecen * saniyelikTuketimHesap;
    harcamaEkle(litre);

    setCalisiyor(false);
    setPlanlananSn(0);
    setKalanSn(0);
    setAsimSn(0);

    if (kalanKayit > 0) {
      setTebrik({ erkenKalanSn: kalanKayit, litre });
    } else if (asimKayit > 0) {
      setAsimOzeti({ asimSn: asimKayit, litre });
    }
  };

  const tebrikKapat = () => setTebrik(null);
  const asimKapat = () => setAsimOzeti(null);

  return (
    <View style={[styles.kart, { backgroundColor: zemin }]}>
      <Text style={[styles.baslik, { color: metin }]}>Duş zamanlayıcısı</Text>

      {!oturumda ? (
        <>
          <Text style={[styles.alt, { color: metin2, marginBottom: 10 }]}>
            Duşa girmeden önce tahmini süreni seç; geri sayım buna göre çalışır. Süreyi aşırsan fazlası
            da sayılır, duşu bitirdiğinde göle yansır.
          </Text>
          <Text style={[styles.altBaslik, { color: metin }]}>Tahmini süre</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cipSatir}>
            {DAKIKA_SECENEKLERI.map((d) => {
              const secili = secilenDakika === d;
              return (
                <Pressable
                  key={d}
                  onPress={() => setSecilenDakika(d)}
                  style={({ pressed }) => [
                    styles.cip,
                    { backgroundColor: secili ? seciliCip : ikincil, opacity: pressed ? 0.9 : 1 },
                  ]}>
                  <Text style={[styles.cipMetin, { color: metin, fontWeight: secili ? '800' : '600' }]}>
                    {d} dk
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </>
      ) : (
        <Text style={[styles.alt, { color: metin2 }]}>
          Planlanan: {sureMetni(planlananSn)} · Toplam geçen: {sureMetni(gecenSn)}
          {asimda && asimSn > 0 ? (
            <Text style={{ color: asimRenk, fontWeight: '700' }}>{' '}· Aşım</Text>
          ) : null}
        </Text>
      )}

      <Text style={[styles.krono, { color: metin }]}>
        {oturumda ? sureMetni(Math.max(0, kalanSn)) : sureMetni(secilenDakika * 60)}
      </Text>
      <Text style={[styles.alt, { color: metin2 }]}>
        {oturumda
          ? asimda
            ? 'Plan süresi doldu (00:00) — fazla süre aşağıda'
            : 'Kalan süre'
          : 'Seçilen süre (önizleme)'}
      </Text>
      {oturumda && asimda ? (
        <Text style={[styles.asimSatir, { color: asimRenk }]}>
          +{sureMetni(asimSn)} aşım
        </Text>
      ) : null}

      <Text style={[styles.alt, { color: metin2 }]}>
        Anlık tüketim:{' '}
        {saniyelikTuketimHesap.toLocaleString('tr-TR', { maximumSignificantDigits: 4 })} L/sn
      </Text>
      {oturumda ? (
        <Text style={[styles.alt, { color: metin2 }]}>
          Şu ana kadar tahmini: {tahminiLitreSuAn.toFixed(2)} L
        </Text>
      ) : null}

      <View style={styles.dugmeSatir}>
        <Pressable
          onPress={baslatVeyaDuraklat}
          style={({ pressed }) => [
            styles.dugme,
            { backgroundColor: birincil, opacity: pressed ? 0.88 : 1 },
          ]}>
          <Text style={styles.dugmeMetin}>
            {!oturumda ? 'Başlat' : calisiyor ? 'Duraklat' : 'Sürdür'}
          </Text>
        </Pressable>
        <Pressable
          onPress={sifirla}
          style={({ pressed }) => [
            styles.dugme,
            { backgroundColor: ikincil, opacity: pressed ? 0.88 : 1 },
          ]}>
          <Text style={[styles.dugmeMetin, { color: metin }]}>{oturumda ? 'İptal' : 'Sıfırla'}</Text>
        </Pressable>
      </View>

      {oturumda ? (
        <Pressable
          onPress={dusuBitirdim}
          style={({ pressed }) => [
            styles.erkenBitir,
            { backgroundColor: koyu ? '#3d5a52' : '#c8ebe0', opacity: pressed ? 0.88 : 1 },
          ]}>
          <Text style={[styles.erkenBitirMetin, { color: metin }]}>Duşu bitirdim</Text>
          <Text style={[styles.erkenBitirAlt, { color: metin2 }]}>
            Harcama: geçirdiğin toplam süre (plan + varsa aşım) × anlık tüketim
          </Text>
        </Pressable>
      ) : null}

      <Modal visible={tebrik != null} transparent animationType="fade" onRequestClose={tebrikKapat}>
        <View style={styles.modalArka}>
          <View style={[styles.modalKutu, { backgroundColor: zemin }]}>
            <Text style={styles.tebrikEmoji}>🎉</Text>
            <Text style={[styles.tebrikBaslik, { color: metin }]}>Tebrikler!</Text>
            <Text style={[styles.tebrikMetin, { color: metin2 }]}>
              Planladığın süreden{' '}
              <Text style={{ fontWeight: '700', color: metin }}>
                {tebrik ? sureOkunur(tebrik.erkenKalanSn) : ''}
              </Text>{' '}
              erken çıktın. Güzel bir alışkanlık.
            </Text>
            <Text style={[styles.tebrikMetin, { color: metin2, marginTop: 10 }]}>
              Kayda eklenen tahmini harcama:{' '}
              <Text style={{ fontWeight: '700', color: birincil }}>
                {tebrik ? `${tebrik.litre.toFixed(2)} L` : ''}
              </Text>
            </Text>
            <Pressable
              onPress={tebrikKapat}
              style={({ pressed }) => [styles.modalDugme, { opacity: pressed ? 0.9 : 1 }]}>
              <Text style={styles.dugmeMetin}>Tamam</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={asimOzeti != null} transparent animationType="fade" onRequestClose={asimKapat}>
        <View style={styles.modalArka}>
          <View style={[styles.modalKutu, { backgroundColor: zemin }]}>
            <Text style={[styles.tebrikBaslik, { color: metin }]}>Süre aşımı kaydedildi</Text>
            <Text style={[styles.tebrikMetin, { color: metin2 }]}>
              Tahmini süreyi{' '}
              <Text style={{ fontWeight: '700', color: asimRenk }}>
                {asimOzeti ? sureOkunur(asimOzeti.asimSn) : ''}
              </Text>{' '}
              aştın; bu süre de harcamaya eklendi.
            </Text>
            <Text style={[styles.tebrikMetin, { color: metin2, marginTop: 10 }]}>
              Toplam kayıt:{' '}
              <Text style={{ fontWeight: '700', color: birincil }}>
                {asimOzeti ? `${asimOzeti.litre.toFixed(2)} L` : ''}
              </Text>
            </Text>
            <Pressable
              onPress={asimKapat}
              style={({ pressed }) => [styles.modalDugme, { opacity: pressed ? 0.9 : 1 }]}>
              <Text style={styles.dugmeMetin}>Tamam</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  kart: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  baslik: { fontSize: 17, fontWeight: '700', marginBottom: 8 },
  altBaslik: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  krono: { fontSize: 44, fontVariant: ['tabular-nums'], fontWeight: '800', letterSpacing: 2 },
  alt: { fontSize: 13, marginTop: 6, lineHeight: 18 },
  asimSatir: { fontSize: 22, fontVariant: ['tabular-nums'], fontWeight: '800', marginTop: 4 },
  cipSatir: { flexDirection: 'row', gap: 8, paddingVertical: 4 },
  cip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  cipMetin: { fontSize: 14 },
  dugmeSatir: { flexDirection: 'row', gap: 12, marginTop: 20 },
  dugme: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  dugmeMetin: { color: '#fff', fontWeight: '700', fontSize: 15 },
  erkenBitir: {
    marginTop: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  erkenBitirMetin: { fontWeight: '700', fontSize: 15 },
  erkenBitirAlt: { fontSize: 12, marginTop: 6, textAlign: 'center' },
  modalArka: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  modalKutu: { borderRadius: 20, padding: 24, alignItems: 'center' },
  tebrikEmoji: { fontSize: 48, marginBottom: 8 },
  tebrikBaslik: { fontSize: 22, fontWeight: '800', marginBottom: 12, textAlign: 'center' },
  tebrikMetin: { fontSize: 15, lineHeight: 22, textAlign: 'center' },
  modalDugme: {
    marginTop: 20,
    backgroundColor: '#0a7ea4',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
    minWidth: 160,
    alignItems: 'center',
  },
});
