import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { loadWordsData, saveWordsData } from "../services/storage";

export default function Form({ onClose }) {
    const [palavra, setPalavra] = useState("");
    const [traducao, setTraducao] = useState("");

    const handleAdd = async () => {
        if (!palavra || !traducao) {
            alert('Necessario preencher todos os campos');
            return;
        }

        const existeWords = await loadWordsData();

        const nextId = existeWords.length > 0 ? Math.max(...existeWords.map(m => m.id)) +1 : 1;

        const newWord = {
            id: nextId,
            title: palavra,
            traducao: traducao,
            favoritar: false
        };

        console.log('Palavra salva: ', newWord);

        await saveWordsData([...existeWords, newWord]);
        onClose();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.buttonFechar} onPress={onClose}>
                <Text style={styles.buttonFecharText}>X</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Insira uma nova palavra</Text>

            <TextInput
                style={styles.input}
                placeholder="Nova Palavra"
                value={palavra}
                onChangeText={setPalavra}
            />

            <TextInput
                style={styles.input}
                placeholder="Tradução"
                value={traducao}
                onChangeText={setTraducao}
            />

            <TouchableOpacity style={styles.button} onPress={handleAdd}>
                <Text style={styles.buttonText}>Adicionar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#fff",
        width: 350,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
        fontWeight: "bold",
        textAlign: "center",
        color: "#000",
    },
    input: {
        width: "100%",
        height: 45,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 12,
        fontSize: 14,
    },
    button: {
        width: "100%",
        backgroundColor: "#4F46E5",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "500",
        fontSize: 14,
        textTransform: "uppercase",
    },
    buttonFechar: {
        position: "absolute",
        top: -15,
        right: -15,
        backgroundColor: "#FF3B30",
        borderRadius: 30,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#FF3B30",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,

    },

    buttonFecharText: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
        lineHeight: 24,
    },
});
