import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import CardWords from "../components/CardWords";
import { loadWordsData } from "../services/storage";

export default function Inicio() {
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWords = async () => {
            const data = await loadWordsData();
            setWords(data);
            setLoading(false)
        };

        fetchWords();
    }, [])

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
                <Text style={{ fontSize: 24, textAlign: 'center', width: 250 }}>Você ainda não tem nenhum card</Text>
            </View>
        );
    }

    return (
        <View>
            <FlatList
                horizontal
                data={words}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <CardWords
                        id={item.id}
                        favoritar={item.favoritar}
                        titulo={item.title}
                        traducao={item.traducao}
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
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})