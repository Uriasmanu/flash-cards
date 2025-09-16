import { FlatList, StyleSheet, Text, View } from "react-native";
import Favoritar from "../components/favoritar";
import { useWords } from "../context/WordsContext";


export default function ListaDePalavras() {

    const { words, loading, handleToggleFavorite } = useWords();

    if (loading) {
        return (
            <View>
                <Text>...Carregando</Text>
            </View>
        )
    }

    if (words.length === 0) {

        return (
            <View style={styles.container}>
                <Text style={{ fontSize: 24, textAlign: 'center', width: 250 }}>Você ainda não tem palavras cadastradas</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={{ textAlign: 'center', fontSize: 28, fontWeight: 'bold' }}>Lista de Palavras</Text>
            <FlatList
                data={words}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.ItemsList}>
                        <View>
                            <Text style={{ fontSize: 22 }}>{item.title}</Text>
                            <Text style={{ fontSize: 16, color: '#757575ff' }}>{item.traducao}</Text>
                        </View>
                        <Favoritar
                            initialChecked={item.favoritar}
                            onChange={() => handleToggleFavorite(item.id)}
                        />
                    </View>

                )}
                ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
            />

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        gap: 20
    },

    ItemsList: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        gap: 10,
        height: 70,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})