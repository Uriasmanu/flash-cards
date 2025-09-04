import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Image
        source={require('./gummy-notebook.png')}
        style={{ width: 200, height: 200 }}
      />
      <Text>Edit app/index.jsx to edit this screen!!!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#fff'
  },
});