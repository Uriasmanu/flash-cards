import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from "expo-status-bar";
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AdBannerMock from '../components/ads/AdBannerMock';
import { WordsProvider } from '../context/WordsContext';

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <WordsProvider>
          <StatusBar style="light" hidden={false} translucent={true} />
          <Drawer
            screenOptions={{
              headerShown: true,
              drawerLabelStyle: { fontSize: 18 },
            }}
            drawerContent={(props) => (
              <DrawerContentScrollView {...props}>
                <View style={{ padding: 20 }}>
                  <Text style={{ fontSize: 18, fontWeight: "bold" }}>Menu</Text>
                </View>
                <DrawerItemList {...props} />
              </DrawerContentScrollView>
            )}
          >
            <Drawer.Screen name="index" options={{ drawerLabel: "Início", title: "Flash Cards" }} />
            <Drawer.Screen name="adicionar" options={{ drawerLabel: "Adicionar Palavras", title: "Adicionar Nova Palavra" }} />
            <Drawer.Screen name="listaDePalavras" options={{ drawerLabel: "Minhas Palavras", title: "Lista de Palavras" }} />
          </Drawer>

         <AdBannerMock />
          <SafeAreaView edges={["bottom"]}>
           
          </SafeAreaView>
        </WordsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
