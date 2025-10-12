import { useWords } from "@/context/WordsContext";
import i18n from "@/locates";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


export default function ListaDeCategoriasScreen() {
    const [search, setSearch] = useState("")

    const {
        handleLoadCategorias,
        countWordsByCategory,
        categorias
    } = useWords();



    useEffect(() => {
        handleLoadCategorias();
    }, []);

    const wordCounts = countWordsByCategory();

    const allCategorias = Array.from(new Set([...categorias, ...Object.keys(wordCounts)]));
    const filteredCategorias = allCategorias.filter(cat =>
        cat.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <View style={styles.container}>
            <TextInput
                placeholder={i18n.t("listaDeCategorias.placeholderBusca")}
                placeholderTextColor="#888"
                style={styles.input}
                onChangeText={setSearch}
            />

            <Text style={styles.sectionTitle}>{i18n.t("listaDeCategorias.tituloSecao")}</Text>

            {filteredCategorias.map((cat) => (
                <TouchableOpacity
                    key={cat}
                    style={styles.categoryCard}
                    onPress={() => router.push(`/listaDePalavras?categoria=${encodeURIComponent(cat)}`)}
                >
                    <View style={styles.colorAccent} />
                    <View style={styles.categoryInfo}>
                        <Text style={styles.categoryName}>{cat}</Text>
                        <Text style={styles.categoryCount}>{wordCounts[cat] || 0}</Text>
                    </View>
                </TouchableOpacity>
            ))}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#f8f9fb",
        paddingVertical: 20,
        gap: 10,
    },

    input: {
        width: "92%",
        backgroundColor: "#fff",
        paddingVertical: 16,
        paddingHorizontal: 18,
        borderRadius: 12,
        fontSize: 17,
        fontWeight: "500",
        color: "#333",
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#333",
        alignSelf: "flex-start",
        marginLeft: "5%",
        marginTop: 10,
    },

    categoryCard: {
        flexDirection: "row",
        alignItems: "center",
        width: "92%",
        height: 90,
        backgroundColor: "#fff",
        borderRadius: 12,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        overflow: "hidden",
    },

    colorAccent: {
        width: 6,
        height: "100%",
        backgroundColor: "#4b7bec",
    },

    categoryInfo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        flex: 1,
        paddingVertical: 18,
        paddingHorizontal: 20,
    },

    categoryName: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },

    categoryCount: {
        fontSize: 18,
        fontWeight: "700",
        color: "#4b7bec",
        marginLeft: 20,
    },
});
