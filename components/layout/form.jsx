import i18n from "@/locates";
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useWords } from "../../context/WordsContext";


export default function Form({ onClose, tituloForm, editingWords, allCategories }) {
    const { handleAdd, handleUpdate, handleLoadCategorias, palavra, traducao, setPalavra, setTraducao } = useWords();
    const [selectedCategory, setSelectedCategory] = useState("Sem Categoria");

    useEffect(() => {
        if (editingWords) {
            setPalavra(editingWords.title);
            setTraducao(editingWords.traducao);
            setSelectedCategory(editingWords.categoria || "Sem Categoria");
        } else {
            setPalavra("");
            setTraducao("");
            setSelectedCategory("Sem Categoria");
        }
    }, [editingWords]);

    const handleSubmit = async () => {
        let success = false;
        if (editingWords) {
            success = await handleUpdate(editingWords.id, palavra, traducao, selectedCategory);
        } else {
            success = await handleAdd(selectedCategory);
        }

        if (success) onClose();
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.buttonFechar} onPress={onClose}>
                <Text style={styles.buttonFecharText}>X</Text>
            </TouchableOpacity>

            <Text style={styles.title}>{tituloForm}</Text>

            {/* Picker de categoria */}
            <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownLabel}>{i18n.t('adicionar.categoria')}</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedCategory}
                        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                        style={styles.picker}
                    >
                        {allCategories.map((category) => (
                            <Picker.Item key={category} label={category} value={category} />
                        ))}
                    </Picker>
                </View>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Nova Palavra"
                value={palavra}
                onChangeText={setPalavra}
            />

            <TextInput
                style={styles.input}
                placeholder="Significado"
                value={traducao}
                onChangeText={setTraducao}
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>{editingWords ? "Salvar" : "Adicionar"}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        maxWidth: 380,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        paddingVertical: 28,
        paddingHorizontal: 22,
        alignItems: "center",

        // sombra mais suave e moderna
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 8,
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1E293B",
        marginBottom: 22,
        textAlign: "center",
    },

    input: {
        width: "100%",
        height: 52,
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        fontSize: 16,
        color: "#1E293B",
    },

    button: {
        width: "100%",
        backgroundColor: "#2563EB",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",

        shadowColor: "#1D4ED8",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 6,
        marginTop: 10,
    },

    buttonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FFFFFF",
        letterSpacing: 0.5,
    },

    buttonFechar: {
        position: "absolute",
        top: -18,
        right: -18,
        backgroundColor: "#EF4444",
        width: 44,
        height: 44,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",

        shadowColor: "#EF4444",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 6,
    },

    buttonFecharText: {
        color: "#FFFFFF",
        fontSize: 22,
        fontWeight: "900",
    },

    dropdownContainer: {
        width: "100%",
        marginBottom: 16,
    },

    dropdownLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1E293B",
        marginBottom: 8,
    },

    pickerContainer: {
        borderWidth: 1,
        borderColor: "#E2E8F0",
        backgroundColor: "#F8FAFC",
        borderRadius: 12,
        overflow: "hidden",

        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },

    picker: {
        width: "100%",
        height: 52,
        fontSize: 16,
    },
});
