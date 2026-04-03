import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { SuUygulamaSaglayici, useSuUygulama } from '@/context/SuUygulamaContext';
import BuAykiBaslangic from '@/ekranlar/BuAykiBaslangic';
import AnaSekmeler from '@/navigation/AnaSekmeler';

function IcKabuk() {
  const { yuklendi, durum } = useSuUygulama();

  if (!yuklendi) {
    return (
      <View style={styles.merkez}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!durum.onboardingTamam) {
    return (
      <SafeAreaView style={styles.guvenli} edges={['top', 'left', 'right']}>
        <BuAykiBaslangic />
      </SafeAreaView>
    );
  }

  return <AnaSekmeler />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.gestureKok}>
      <SafeAreaProvider>
        <SuUygulamaSaglayici>
          <NavigationContainer>
            <StatusBar style="auto" />
            <IcKabuk />
          </NavigationContainer>
        </SuUygulamaSaglayici>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureKok: { flex: 1 },
  guvenli: { flex: 1, backgroundColor: '#bfe5f2' },
  merkez: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#bfe5f2' },
});
