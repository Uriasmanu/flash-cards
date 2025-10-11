import { useWords } from "@/context/WordsContext";
import React, { useState } from "react";
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


  const handleSubmit = async () => {
    try {
      if (!palavra.trim() || !traducao.trim()) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
      }

      const success = await handleAdd();

      if (success) {
        setShowSuccess(true);
        setPalavra("");
        setTraducao("");
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
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={styles.textTitulo}>Frente do Card</Text>
                <Text style={styles.textTitulo}>(Termo ou Pergunta)</Text>
              </View>
              <Text style={styles.obrigatorio}>Obrigatorio</Text>
            </View>


            <TextInput
              style={styles.input}
              placeholder="Ex: Qual é a capital da França?"
              value={palavra}
              onChangeText={setPalavra}
            />

            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={styles.textTitulo}>Verso do Card</Text>
                <Text style={styles.textTitulo}>(Definição/Resposta)</Text>
              </View>
              <Text style={styles.obrigatorio}>Obrigatorio</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Ex: Paris"
              value={traducao}
              onChangeText={setTraducao}
            />

          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>
              SALVAR FLASH CARD
            </Text>
          </TouchableOpacity>
        </View>

        {/* Mensagem de sucesso só aparece se showSuccess for true */}
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
  initialContent: {
    alignItems: "center",
    width: "100%",
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
  textTitulo: {
    fontSize: 16,
    fontWeight: 600,
    color: "#1a1a1a",
    textTransform: 'uppercase',
    width: '100%'
  },
  obrigatorio: {
    padding: 10,
    borderRadius: 50,
    height: 38,
    fontWeight: 600,
    fontSize: 14,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#b8860b',
    backgroundColor: '#ede1757c',
    letterSpacing: 1
  },
  input: {
    width: "100%",
    height: '32%',
    borderWidth: 1,
    borderColor: "#8fb4ffff",
    borderRadius: 8,
    paddingHorizontal: 16,
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