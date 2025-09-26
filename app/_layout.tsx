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
            name="inicio/index"
            options={{
              drawerLabel: 'inicio',
              title: '',
              drawerLabelStyle: {
                fontSize: 18,
              },
            }}
          />

          <Drawer.Screen
            name="adicionar/index"
            options={{
              drawerLabel: 'adicionar',
              title: '',
              drawerLabelStyle: {
                fontSize: 18,
              },
            }}
          />

          <Drawer.Screen
            name="listaDePalavras/index"
            options={{
              drawerLabel: 'lista de palavras',
              title: '',
              drawerLabelStyle: {
                fontSize: 18,
              },
            }}
          />
        </Drawer>
      </WordsProvider>
    </GestureHandlerRootView>
  );
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { state, descriptors, navigation, ...restProps } = props;
  return (
    <DrawerContentScrollView {...restProps}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Menu</Text>
      </View>
      <DrawerItemList
        state={props.state}
        descriptors={props.descriptors}
        navigation={props.navigation}
      />
    </DrawerContentScrollView>
  );
}
