import { useEffect } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useWords } from "../context/WordsContext";


export default function Form({ onClose, tituloForm, editingWords }) {
    const { handleAdd, handleUpdate, palavra, traducao, setPalavra, setTraducao } = useWords();

    useEffect(() => {
        if (editingWords) {
            setPalavra(editingWords.title)
            setTraducao(editingWords.traducao)
        } else {
            setPalavra("")
            setTraducao("")
        }
    }, [editingWords]);

    const handleSubmit = async () => {
        try {
            let success;
            if (editingWords) {
                success = await handleUpdate(editingWords.id, palavra, traducao)
            } else {
                success = await handleAdd();
            }

            if (success) {
                onClose();
            }

        } catch (error) {
            console.error('Erro no formulario:', error)
        }
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.buttonFechar} onPress={onClose}>
                <Text style={styles.buttonFecharText}>X</Text>
            </TouchableOpacity>

            <Text style={styles.title}>{tituloForm}</Text>

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

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>
                    {editingWords ? "Salvar" : "Adicionar"}
                </Text>
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
        boxShadowColor: "#000",
        boxShadowOffset: { width: 0, height: 4 },
        boxShadowOpacity: 0.1,
        boxShadowRadius: 6,
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
        boxShadowColor: "#FF3B30",
        boxShadowOffset: { width: 0, height: 4 },
        boxShadowOpacity: 0.3,
        boxShadowRadius: 6,
        elevation: 6,

    },

    buttonFecharText: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
        lineHeight: 24,
    },
});
