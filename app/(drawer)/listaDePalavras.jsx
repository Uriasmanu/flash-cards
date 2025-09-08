import { StyleSheet, Text, View } from "react-native";

export default function ListaDePalavras() {

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 24, textAlign: 'center', width: 250}}>Você ainda não tem palavras cadastradas</Text>
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