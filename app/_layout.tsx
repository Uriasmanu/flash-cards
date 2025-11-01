import { NotificationProvider } from '@/context/NotificationContext';
import i18n from '@/locates';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import { Settings } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { WordsProvider } from '../context/WordsContext';

export default function RootLayout() {
  // Estado para forçar o rerender quando o idioma mudar
  const [currentLocale, setCurrentLocale] = useState(i18n.locale);

  // Escutar mudanças de idioma
  useEffect(() => {
    const interval = setInterval(() => {
      if (i18n.locale !== currentLocale) {
        setCurrentLocale(i18n.locale);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentLocale]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <WordsProvider>
          <NotificationProvider>
            <View style={styles.container}>
              <View style={styles.drawerContainer}>
                <Drawer
                  key={currentLocale} // Adiciona key para forçar rerender do Drawer
                  screenOptions={{
                    headerShown: true,
                    drawerLabelStyle: { fontSize: 16 },
                  }}
                  drawerContent={(props) => (
                    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
                      <View style={{ padding: 20 }}>
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Menu</Text>
                      </View>
                      <DrawerItemList {...props} />

                      <View style={{ flex: 1 }} />

                      <DrawerItem
                        label={i18n.t('layout.configuracao')}
                        icon={() => <Settings />}
                        onPress={() => props.navigation.navigate('SettingsScreen')}
                      />
                    </DrawerContentScrollView>
                  )}
                >
                  <Drawer.Screen
                    name="index"
                    options={{
                      drawerLabel: i18n.t('layout.indexTitulo'),
                      title: i18n.t('layout.indexTitulo')
                    }}
                  />
                  <Drawer.Screen
                    name="adicionar"
                    options={{
                      drawerLabel: i18n.t('layout.adicionarTitulo'),
                      title: i18n.t('layout.adicionarTitulo')
                    }}
                  />
                  <Drawer.Screen
                    name="listaDePalavras"
                    options={{
                      drawerLabel: () => null,
                      drawerItemStyle: { display: 'none' },
                      title: i18n.t('layout.listaPalavrasTitulo'),
                    }}
                  />

                  <Drawer.Screen
                    name="listaDeCategoriasScreen"
                    options={{
                      drawerLabel: i18n.t('layout.listaCategoriasTitulo'),
                      title: i18n.t('layout.listaCategoriasTitulo'),
                    }}
                  />

                  <Drawer.Screen
                    name="resumoScreen"
                    options={{
                      drawerLabel: i18n.t('layout.resumoTitulo'),
                      title: i18n.t('layout.resumoTitulo'),
                    }}
                  />

                  <Drawer.Screen
                    name="SettingsScreen"
                    options={{
                      drawerLabel: () => null,
                      drawerItemStyle: { display: 'none' },
                      title: i18n.t('layout.configuracao'),
                    }}
                  />
                </Drawer>
              </View>
              <SafeAreaView edges={["bottom"]}>
                
                {/*  <AdBannerMock /> <AdBanner forceRealAds={true} /> */}

              </SafeAreaView>
            </View>
          </NotificationProvider>
        </WordsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerContainer: {
    flex: 1,
  },
});