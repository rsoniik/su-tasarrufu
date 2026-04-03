import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useColorScheme } from 'react-native';

import AyarlarEkrani from '@/ekranlar/AyarlarEkrani';
import DusSekmesi from '@/ekranlar/DusSekmesi';
import LiderlikEkrani from '@/ekranlar/LiderlikEkrani';
import ProfilEkrani from '@/ekranlar/ProfilEkrani';

export type AnaSekmeParamList = {
  Dus: undefined;
  Liderlik: undefined;
  Profil: undefined;
  Ayarlar: undefined;
};

const Tab = createBottomTabNavigator<AnaSekmeParamList>();

export default function AnaSekmeler() {
  const scheme = useColorScheme();
  const koyu = scheme === 'dark';

  const tabBarStil = koyu
    ? { backgroundColor: '#152428', borderTopColor: '#243842' }
    : { backgroundColor: '#e8f6fb', borderTopColor: '#bfe5f2' };

  return (
    <Tab.Navigator
      initialRouteName="Dus"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0a7ea4',
        tabBarInactiveTintColor: koyu ? '#6d8a94' : '#6b8a94',
        tabBarStyle: tabBarStil,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, size }) => {
          const ikonlar: Record<keyof AnaSekmeParamList, keyof typeof Ionicons.glyphMap> = {
            Dus: 'timer-outline',
            Liderlik: 'trophy-outline',
            Profil: 'person-outline',
            Ayarlar: 'settings-outline',
          };
          const ad = ikonlar[route.name];
          return <Ionicons name={ad} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Dus" component={DusSekmesi} options={{ title: 'Duş' }} />
      <Tab.Screen name="Liderlik" component={LiderlikEkrani} options={{ title: 'Liderlik' }} />
      <Tab.Screen name="Profil" component={ProfilEkrani} options={{ title: 'Profil' }} />
      <Tab.Screen name="Ayarlar" component={AyarlarEkrani} options={{ title: 'Ayarlar' }} />
    </Tab.Navigator>
  );
}
