import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AylikOzet from '@/ekranlar/AylikOzet';

export default function ProfilEkrani() {
  const scheme = useColorScheme();
  const koyu = scheme === 'dark';

  const [ozetGorunur, setOzetGorunur] = useState(false);

  const arka = koyu ? '#0f1a1f' : '#bfe5f2';
  const metin = koyu ? '#f2f6f8' : '#0d3d4d';
  const metin2 = koyu ? '#9eb8c4' : '#4a6b78';
  const kart = koyu ? '#1a2e36' : '#fff';

  return (
    <>
      <ScrollView
        style={[styles.kok, { backgroundColor: arka }]}
        contentContainerStyle={styles.ic}
        showsVerticalScrollIndicator={false}>
        <Text style={[styles.baslik, { color: metin }]}>Profil</Text>

        <View style={[styles.avatarKutu, { backgroundColor: kart }]}>
          <View style={[styles.avatar, { backgroundColor: koyu ? '#2a4552' : '#cfeaf5' }]}>
            <Text style={[styles.avatarHarf, { color: metin }]}>S</Text>
          </View>
          <Text style={[styles.ad, { color: metin }]}>Su Tasarrufu</Text>
          <Text style={[styles.altAd, { color: metin2 }]}>Tasarruf hedefin takipte</Text>
        </View>

        <Pressable
          onPress={() => setOzetGorunur(true)}
          style={({ pressed }) => [
            styles.ozetDugme,
            { backgroundColor: kart, opacity: pressed ? 0.92 : 1 },
          ]}>
          <Text style={[styles.ozetDugmeMetin, { color: metin }]}>Bu ayın özeti — detay</Text>
          <Text style={[styles.ozetDugmeAlt, { color: metin2 }]}>
            Harcama, limit ve teknik bilgiler
          </Text>
        </Pressable>
      </ScrollView>

      <Modal visible={ozetGorunur} animationType="slide" onRequestClose={() => setOzetGorunur(false)}>
        <SafeAreaView style={[styles.modalKok, { backgroundColor: arka }]} edges={['top']}>
          <View style={styles.modalUst}>
            <Text style={[styles.modalBaslik, { color: metin }]}>Bu ayın özeti</Text>
            <Pressable onPress={() => setOzetGorunur(false)} hitSlop={12}>
              <Text style={[styles.kapat, { color: '#0a7ea4' }]}>Kapat</Text>
            </Pressable>
          </View>
          <AylikOzet />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  kok: { flex: 1 },
  ic: { padding: 20, paddingBottom: 40, gap: 16 },
  baslik: { fontSize: 24, fontWeight: '700' },
  avatarKutu: { borderRadius: 20, padding: 24, alignItems: 'center' },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarHarf: { fontSize: 28, fontWeight: '700' },
  ad: { marginTop: 12, fontSize: 18, fontWeight: '700' },
  altAd: { marginTop: 4, fontSize: 14 },
  ozetDugme: { borderRadius: 16, padding: 18 },
  ozetDugmeMetin: { fontSize: 16, fontWeight: '600' },
  ozetDugmeAlt: { fontSize: 13, marginTop: 4 },
  modalKok: { flex: 1 },
  modalUst: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalBaslik: { fontSize: 18, fontWeight: '700' },
  kapat: { fontSize: 16, fontWeight: '600' },
});
