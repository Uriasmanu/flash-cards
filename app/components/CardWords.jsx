import { Languages } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import BotaoTraduzir from "./botaoTraduzir";
import Favoritar from "./favoritar";


export default function CardWords({ id, favoritar, titulo, traducao }) {

    return (
        <View style={styles.container}>
            <View style={styles.favoritar}>
                <Favoritar>{favoritar ? 'sim' : 'nao'}</Favoritar>
            </View>

            <Languages style={{ width: 90, height: 90 }} />

            <View style={{ gap: 25, marginTop: 25 }}>
                <Text style={styles.text}>{titulo}</Text>
                <BotaoTraduzir/>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        borderWidth: 2,
        borderRadius: 14,
        height: 500,
        width: 320,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        backgroundColor: '#fff'
    },
    text: {
        fontSize: 32
    },

    favoritar: {
        position: 'absolute',
        top: 0,
        left: 0
    }
})