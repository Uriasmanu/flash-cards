import { useWords } from "@/context/WordsContext";
import i18n from "@/locates";
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Sucesso from './../components/layout/sucesso';

export default function CardsScreen() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [keyboardPadding, setKeyboardPadding] = useState(0);

  const {
    handleAdd,
    handleAddCategoria,
    handleLoadCategorias,
    palavra,
    traducao,
    categorias,
    setPalavra,
    setTraducao
  } = useWords();

  const [currentLocale, setCurrentLocale] = useState(i18n.locale);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [mode, setMode] = useState<"select" | "add">("select");

  // Atualiza idioma
  useEffect(() => {
    const interval = setInterval(() => {
      if (i18n.locale !== currentLocale) {
        setCurrentLocale(i18n.locale);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentLocale]);

  const handleSubmit = async () => {
    if (!palavra.trim() || !traducao.trim()) {
      alert(i18n.t('adicionar.alerta'));
      return;
    }

    const success = await handleAdd(selectedCategory);
    if (success) {
      setShowSuccess(true);
      setPalavra("");
      setTraducao("");
      setSelectedCategory("");
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };


  // Ajuste de teclado
  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardPadding(10));
    const hideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardPadding(0));
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  useEffect(() => {
    handleLoadCategorias();
  }, [])

  return (
    <KeyboardAvoidingView
      key={currentLocale}
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>

            {/* Selecionar ou criar categoria */}
            <View style={styles.modeSwitchContainer}>
              <TouchableOpacity
                style={[styles.modeButton, mode === "select" && styles.modeButtonActive]}
                onPress={() => setMode("select")}
              >
                <Text style={styles.modeButtonText}>Selecionar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeButton, mode === "add" && styles.modeButtonActive]}
                onPress={() => setMode("add")}
              >
                <Text style={styles.modeButtonText}>Adicionar nova</Text>
              </TouchableOpacity>
            </View>

            {mode === "select" ? (
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownLabel}>{i18n.t('adicionar.categoria')}</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedCategory}
                    onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item key="none" label="Sem categoria" value="" />
                    {categorias.map(cat => (
                      <Picker.Item key={cat} label={cat} value={cat} />
                    ))}
                  </Picker>
                </View>
              </View>
            ) : (
              <View style={styles.newCategoryContainer}>
                <TextInput
                  style={styles.newCategoryInput}
                  placeholder="Nova categoria"
                  value={newCategory}
                  onChangeText={setNewCategory}
                />
                <TouchableOpacity
                  style={styles.newCategoryButton}
                  onPress={async () => {
                    if (newCategory.trim()) {
                      handleAddCategoria(newCategory.trim());
                      setSelectedCategory(newCategory.trim());
                      setNewCategory("");
                      setMode("select");
                    }
                  }}
                >
                  <Text style={styles.newCategoryButtonText}>Adicionar</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Palavra */}
            <TextInput
              style={styles.input}
              placeholder={i18n.t('adicionar.exemploPalavra')}
              value={palavra}
              onChangeText={setPalavra}
              multiline
            />

            {/* Tradução */}
            <TextInput
              style={styles.input}
              placeholder={i18n.t('adicionar.exemploResposta')}
              value={traducao}
              onChangeText={setTraducao}
              multiline
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>{i18n.t('adicionar.botaoSalvar')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showSuccess && (
          <View style={styles.successContainer}>
            <Sucesso />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f6f68a", alignItems: "center" },
  scrollContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center", paddingBottom: 16 },
  formContainer: { alignItems: 'center', width: 380, maxWidth: 400, marginTop: 20, borderWidth: 1, borderRadius: 20, borderColor: '#130a8f79', backgroundColor: "#fff", padding: 15 },
  inputContainer: { alignItems: 'flex-start', width: '100%', gap: 15 },
  modeSwitchContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 12 },
  modeButton: { flex: 1, paddingVertical: 8, marginHorizontal: 4, borderRadius: 8, backgroundColor: '#e0e0e0', alignItems: 'center' },
  modeButtonActive: { backgroundColor: '#4F46E5' },
  modeButtonText: { color: '#fff', fontWeight: '600' },
  dropdownContainer: { width: '100%', marginBottom: 12 },
  dropdownLabel: { fontSize: 16, fontWeight: '600', color: "#1a1a1a", marginBottom: 8 },
  pickerContainer: { borderWidth: 1, borderColor: "#8fb4ffff", borderRadius: 8, overflow: 'hidden' },
  picker: { width: '100%', height: 50 },
  newCategoryContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: 8, gap: 8 },
  newCategoryInput: { flex: 1, height: 45, borderWidth: 1, borderColor: "#8fb4ffff", borderRadius: 8, paddingHorizontal: 12, fontSize: 16 },
  newCategoryButton: { backgroundColor: "#4F46E5", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  newCategoryButtonText: { color: "#fff", fontWeight: "600", fontSize: 14, textTransform: "uppercase" },
  input: { width: "100%", height: 120, borderWidth: 1, borderColor: "#8fb4ffff", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, textAlignVertical: 'top', marginBottom: 12 },
  button: { width: "100%", backgroundColor: "#4F46E5", paddingVertical: 12, borderRadius: 8, alignItems: "center", marginTop: 20 },
  buttonText: { color: "#fff", fontWeight: "500", fontSize: 14, textTransform: "uppercase" },
  successContainer: { position: "absolute", bottom: 20, left: 0, right: 0, alignItems: "center" },
});
