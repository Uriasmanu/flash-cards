import { StyleSheet, Text, View } from "react-native";



export default function Inicio() {

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 24, textAlign: 'center', width: 250}}>Você ainda não tem nenhum card</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})