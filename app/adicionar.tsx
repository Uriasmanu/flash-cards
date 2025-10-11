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
  TouchableOpacity,
  View
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Sucesso from './../components/layout/sucesso';

export default function CardsScreen() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [keyboardPadding, setKeyboardPadding] = useState(0);
  const { handleAdd, palavra, traducao, setPalavra, setTraducao } = useWords();

  const [currentLocale, setCurrentLocale] = useState(i18n.locale);
  const [selectedCategory, setSelectedCategory] = useState(""); 
  

  const categories = [
    { label: 'Selecione uma categoria', value: '' },
    { label: 'Verbos', value: 'verbos' },
    { label: 'Substantivos', value: 'substantivos' },
    { label: 'Adjetivos', value: 'adjetivos' },
    { label: 'Expressões', value: 'expressoes' },
  ];

  // Escutar mudanças de idioma
  useEffect(() => {
    const interval = setInterval(() => {
      if (i18n.locale !== currentLocale) {
        setCurrentLocale(i18n.locale);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentLocale]);

  const handleSubmit = async () => {
    try {
      if (!palavra.trim() || !traducao.trim() || !selectedCategory) {
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
    } catch (error) {
      console.error("Erro no formulário:", error);
    }
  };

  // Detecta quando o teclado aparece/desaparece
  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardPadding(10);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardPadding(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

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
            
            {/* Dropdown de Categoria */}
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>{i18n.t('adicionar.categoria')}</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedCategory}
                  onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                  style={styles.picker}
                >
                  {categories.map((category) => (
                    <Picker.Item 
                      key={category.value} 
                      label={category.label} 
                      value={category.value} 
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={styles.textTitulo}>{i18n.t('adicionar.tituloFrente1')}</Text>
                <Text style={styles.textTitulo}>{i18n.t('adicionar.tituloFrente2')}</Text>
              </View>
              <Text style={styles.obrigatorio}>{i18n.t('adicionar.requeride')}</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder={i18n.t('adicionar.exemploPalavra')}
              value={palavra}
              onChangeText={setPalavra}
              multiline={true}
              numberOfLines={4}
            />

            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={styles.textTitulo}>{i18n.t('adicionar.tituloVerso1')}</Text>
                <Text style={styles.textTitulo}>{i18n.t('adicionar.tituloVerso2')}</Text>
              </View>
              <Text style={styles.obrigatorio}>{i18n.t('adicionar.requeride')}</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder={i18n.t('adicionar.exemploResposta')}
              value={traducao}
              onChangeText={setTraducao}
              multiline={true}
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>
              {i18n.t('adicionar.botaoSalvar')}
            </Text>
          </TouchableOpacity>
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
  container: {
    flex: 1,
    backgroundColor: "#f6f6f68a",
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 16,
  },
  formContainer: {
    alignItems: 'center',
    width: 380,
    height: '95%',
    maxWidth: 400,
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#130a8f79',
    backgroundColor: "#fff",
    padding: 15,
  },
  inputContainer: {
    alignItems: 'flex-start',
    width: '100%',
    gap: 15
  },
  dropdownContainer: {
    width: '100%',
    marginBottom: 12,
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: "#1a1a1a",
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#8fb4ffff",
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  textTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: "#1a1a1a",
    textTransform: 'uppercase',
    width: '100%'
  },
  obrigatorio: {
    padding: 10,
    borderRadius: 50,
    height: 38,
    fontWeight: '600',
    fontSize: 14,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#b8860b',
    backgroundColor: '#ede1757c',
    letterSpacing: 1
  },
  input: {
    width: "100%",
    height: 120,
    borderWidth: 1,
    borderColor: "#8fb4ffff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  button: {
    width: "100%",
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
    textTransform: "uppercase",
  },
  successContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
});