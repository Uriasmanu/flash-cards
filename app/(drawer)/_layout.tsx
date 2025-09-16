import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { WordsProvider } from '../context/WordsContext';


export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <WordsProvider>
        <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>

          <Drawer.Screen
            name="index"
            options={{
              drawerLabel: 'index',
              title: '',
              drawerItemStyle: { display: 'none' }
            }}
          />

          <Drawer.Screen
            name="inicio"
            options={{
              drawerLabel: 'inicio',
              title: '',
              drawerLabelStyle: {
                fontSize: 18
              }
            }}
          />

          <Drawer.Screen
            name='adicionar'
            options={{
              drawerLabel: 'adicionar',
              title: '',
              drawerLabelStyle: {
                fontSize: 18
              }
            }}
          />

          <Drawer.Screen
            name='listaDePalavras'
            options={{
              drawerLabel: 'lista de palavras',
              title: '',
              drawerLabelStyle: {
                fontSize: 18
              }
            }}
          />
        </Drawer>
      </WordsProvider>
    </GestureHandlerRootView>
  );
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Menu</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}
