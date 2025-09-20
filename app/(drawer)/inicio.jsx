import { FlatList, StyleSheet, Text, View } from "react-native";
import { useWords } from "../../context/WordsContext";
import CardWords from "../components/CardWords";


export default function Inicio() {

    const { words, loading, handleToggleFavorite } = useWords();
    const filteredWords = words.filter(word => !word.favoritar)

    if (loading) {
        return (
            <View>
                <Text>...Carregando</Text>
            </View>
        )
    }

    if (filteredWords.length === 0) {

        return (
            <View style={styles.container}>
                <Text style={{ fontSize: 24, textAlign: 'center', width: 250 }}>
                    {words.length === 0
                        ? 'Você ainda não tem nenhum card'
                        : 'Todas as palavras foram favoritadas'
                    }
                </Text>
            </View>
        );
    }

    return (
        <View style={{
            marginHorizontal: 20,
            marginVertical: 100
        }}>
            <FlatList
                horizontal
                data={filteredWords}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <CardWords
                        id={item.id}
                        favoritar={item.favoritar}
                        titulo={item.title}
                        traducao={item.traducao}
                        onToggleFavorite={handleToggleFavorite}
                    />
                )}
                pagingEnabled
                showsHorizontalScrollIndicator={true}
                snapToAlignment="start"
                contentContainerStyle={{
                    paddingHorizontal: 10,
                }}
                ItemSeparatorComponent={() => <View style={{ width: 28 }} />}
            />

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: 'center',
        height: '90%'
    }
})