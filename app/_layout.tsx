import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AdBannerMock from '../components/ads/AdBannerMock';
import { WordsProvider } from '../context/WordsContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <WordsProvider>
        <Drawer
          screenOptions={{
            headerShown: true,
            drawerLabelStyle: {
              fontSize: 18,
            },
          }}
          drawerContent={(props) => (
            <DrawerContentScrollView {...props}>
              <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Menu</Text>
              </View>
              <DrawerItemList {...props} />
            </DrawerContentScrollView>
          )}
        >
          {/* Tela inicial */}
          <Drawer.Screen
            name="index"
            options={{
              drawerLabel: "Início",
              title: "Flash Cards",
            }}
          />
          
          {/* Tela adicionar */}
          <Drawer.Screen
            name="adicionar"
            options={{
              drawerLabel: "Adicionar Palavras",
              title: "Adicionar Nova Palavra",
            }}
          />
          
          {/* Tela listaDePalavras */}
          <Drawer.Screen
            name="listaDePalavras"
            options={{
              drawerLabel: "Minhas Palavras",
              title: "Lista de Palavras",
            }}
          />
        </Drawer>
        <AdBannerMock />
      </WordsProvider>
    </GestureHandlerRootView>
  );
}