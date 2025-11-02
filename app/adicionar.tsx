import { useWords } from "@/context/WordsContext";
import i18n from "@/locates";
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Sucesso from './../components/layout/sucesso';

// --- Cores e Design System Consistente ---
const COLORS = {
  PRIMARY: '#2563EB',
  PRIMARY_DARK: '#1D4ED8',
  BACKGROUND: '#FFFFFF',
  BACKGROUND_GRAY: '#F8FAFC',
  CARD_BACKGROUND: '#FFFFFF',
  TEXT_PRIMARY: '#1E293B',
  TEXT_SECONDARY: '#64748B',
  TEXT_DISABLED: '#94A3B8',
  BORDER: '#E2E8F0',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  SWITCH_ACTIVE: '#2563EB',
  SWITCH_INACTIVE: '#E2E8F0',
};

const { width: screenWidth } = Dimensions.get('window');

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
  const [fadeAnim] = useState(new Animated.Value(0));

  // Atualiza idioma
  useEffect(() => {
    const interval = setInterval(() => {
      if (i18n.locale !== currentLocale) {
        setCurrentLocale(i18n.locale);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentLocale]);

  // Animação de entrada
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

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
    const showListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardPadding(20));
    const hideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardPadding(0));
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  useEffect(() => {
    handleLoadCategorias();
  }, []);

  const handleModeChange = (newMode: "select" | "add") => {
    setMode(newMode);
    if (newMode === "select") {
      setNewCategory("");
    }
  };

  const handleAddNewCategory = async () => {
    if (newCategory.trim()) {
      await handleAddCategoria(newCategory.trim());
      setSelectedCategory(newCategory.trim());
      setNewCategory("");
      setMode("select");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BACKGROUND_GRAY} />
      <KeyboardAvoidingView
        key={currentLocale}
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim }]}>
          <ScrollView
            contentContainerStyle={[styles.scrollContainer, { paddingBottom: keyboardPadding }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                {i18n.t('layout.adicionarTitulo')}
              </Text>
            </View>

            {/* Card Container */}
            <View style={styles.card}>
              {/* Categoria Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {i18n.t('adicionar.categoria')}
                  <Text style={styles.required}> *</Text>
                </Text>
                
                {/* Mode Switch */}
                <View style={styles.modeSwitchContainer}>
                  <TouchableOpacity
                    style={[
                      styles.modeButton, 
                      mode === "select" && styles.modeButtonActive
                    ]}
                    onPress={() => handleModeChange("select")}
                  >
                    <Text style={[
                      styles.modeButtonText,
                      mode === "select" && styles.modeButtonTextActive
                    ]}>
                      {i18n.t('adicionar.modoSelecionar')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modeButton, 
                      mode === "add" && styles.modeButtonActive
                    ]}
                    onPress={() => handleModeChange("add")}
                  >
                    <Text style={[
                      styles.modeButtonText,
                      mode === "add" && styles.modeButtonTextActive
                    ]}>
                      {i18n.t('adicionar.modoAdicionar')}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Category Input */}
                {mode === "select" ? (
                  <View style={styles.dropdownContainer}>
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={selectedCategory}
                        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                        style={styles.picker}
                        dropdownIconColor={COLORS.PRIMARY}
                      >
                        <Picker.Item 
                          key="none" 
                          label={i18n.t('adicionar.semCategoria')} 
                          value="" 
                        />
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
                      placeholder={i18n.t('adicionar.placeholderNovaCategoria')}
                      placeholderTextColor={COLORS.TEXT_DISABLED}
                      value={newCategory}
                      onChangeText={setNewCategory}
                      returnKeyType="done"
                      onSubmitEditing={handleAddNewCategory}
                    />
                    <TouchableOpacity
                      style={[
                        styles.newCategoryButton,
                        !newCategory.trim() && styles.newCategoryButtonDisabled
                      ]}
                      onPress={handleAddNewCategory}
                      disabled={!newCategory.trim()}
                    >
                      <Text style={styles.newCategoryButtonText}>
                        {i18n.t('adicionar.botaoAddCategoria')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Frente do Card */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {i18n.t('adicionar.tituloFrente1')}
                  <Text style={styles.required}> *</Text>
                </Text>
                <Text style={styles.sectionSubtitle}>
                  {i18n.t('adicionar.tituloFrente2')}
                </Text>
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  placeholder={i18n.t('adicionar.exemploPalavra')}
                  placeholderTextColor={COLORS.TEXT_DISABLED}
                  value={palavra}
                  onChangeText={setPalavra}
                  multiline
                  textAlignVertical="top"
                  maxLength={100}
                />
                <Text style={styles.charCount}>
                  {palavra.length}/100
                </Text>
              </View>

              {/* Verso do Card */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {i18n.t('adicionar.tituloVerso1')}
                  <Text style={styles.required}> *</Text>
                </Text>
                <Text style={styles.sectionSubtitle}>
                  {i18n.t('adicionar.tituloVerso2')}
                </Text>
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  placeholder={i18n.t('adicionar.exemploResposta')}
                  placeholderTextColor={COLORS.TEXT_DISABLED}
                  value={traducao}
                  onChangeText={setTraducao}
                  multiline
                  textAlignVertical="top"
                  maxLength={100}
                />
                <Text style={styles.charCount}>
                  {traducao.length}/100
                </Text>
              </View>

              {/* Submit Button */}
              <TouchableOpacity 
                style={[
                  styles.button,
                  (!palavra.trim() || !traducao.trim()) && styles.buttonDisabled
                ]} 
                onPress={handleSubmit}
                disabled={!palavra.trim() || !traducao.trim()}
              >
                <Text style={styles.buttonText}>
                  {i18n.t('adicionar.botaoSalvar')}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Success Message */}
          {showSuccess && (
            <View style={styles.successContainer}>
              <Sucesso />
            </View>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_GRAY,
  },
  container: {
    flex: 1,
  },
  animatedContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 22,
  },
  card: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 12,
  },
  required: {
    color: COLORS.ERROR,
  },
  modeSwitchContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.SWITCH_INACTIVE,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: COLORS.SWITCH_ACTIVE,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
  },
  modeButtonTextActive: {
    color: COLORS.BACKGROUND,
  },
  dropdownContainer: {
    width: '100%',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.BACKGROUND,
  },
  picker: {
    width: '100%',
    height: 56,
    color: COLORS.TEXT_PRIMARY,
  },
  newCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  newCategoryInput: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    backgroundColor: COLORS.BACKGROUND,
  },
  newCategoryButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  newCategoryButtonDisabled: {
    backgroundColor: COLORS.TEXT_DISABLED,
    shadowOpacity: 0,
    elevation: 0,
  },
  newCategoryButtonText: {
    color: COLORS.BACKGROUND,
    fontWeight: '600',
    fontSize: 14,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    backgroundColor: COLORS.BACKGROUND,
  },
  multilineInput: {
    height: 100,
    paddingTop: 16,
    paddingBottom: 16,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: COLORS.TEXT_DISABLED,
    textAlign: 'right',
    marginTop: 4,
  },
  button: {
    width: '100%',
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: COLORS.TEXT_DISABLED,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: COLORS.BACKGROUND,
    fontWeight: '600',
    fontSize: 16,
    textTransform: "uppercase",
  },
  successContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
});