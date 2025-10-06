import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import { Settings } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { WordsProvider } from '../context/WordsContext';
import AdBannerMock from './../components/ads/AdBannerMock';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <WordsProvider>
          <View style={styles.container}>
            <View style={styles.drawerContainer}>
              <Drawer
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
                      label="Configuração"
                      icon={() => <Settings/>}
                      onPress={() => props.navigation.navigate('SettingsScreen')}
                    />
                  </DrawerContentScrollView>
                )}
              >
                <Drawer.Screen
                  name="index"
                  options={{ drawerLabel: "Início", title: "Flash Cards" }}
                />
                <Drawer.Screen
                  name="adicionar"
                  options={{ drawerLabel: "Adicionar Palavras", title: "Adicionar Nova Palavra" }}
                />
                <Drawer.Screen
                  name="listaDePalavras"
                  options={{ drawerLabel: "Lista De Palavra", title: "Lista de Palavras" }}
                />

                <Drawer.Screen
                  name="SettingsScreen"
                  options={{ drawerLabel: () => null, drawerItemStyle: {display: 'none'} }}
                />
              </Drawer>
            </View>
            <SafeAreaView edges={["bottom"]}>
          {/*    <AdBanner forceRealAds={true} />*/}
          <AdBannerMock/>
            </SafeAreaView>
          </View>
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
