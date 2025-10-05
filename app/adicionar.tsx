import { SquarePlus } from "lucide-react-native";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import Form from "../components/layout/form";
import Sucesso from './../components/layout/sucesso';

export default function CardsScreen() {
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [keyboardPadding, setKeyboardPadding] = useState(0);

  const handleCloseForm = () => {
    setShowForm(false);
    setShowSuccess(true);

    // esconde depois de 2s
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  // Opcional: Detecta quando o teclado aparece/desaparece
  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        // Adiciona 10px de margem do topo do teclado
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
        {!showForm && (
          <View style={styles.initialContent}>
            <Pressable
              onPress={() => setShowForm(true)}
              style={({ pressed }) => [
                styles.addButton,
                {
                  backgroundColor: pressed ? "#f5f5f5" : "#e8e8e8ff",
                },
              ]}
            >
              <SquarePlus color="black" size={80} />
            </Pressable>

            <Text style={styles.instructionText}>
              Clique para adicionar uma palavra
            </Text>
          </View>
        )}

        {showForm && (
          <View style={[styles.formContainer, { marginBottom: keyboardPadding }]}>
            <Form
              onClose={handleCloseForm}
              tituloForm={"Insira Uma Nova Palavra"}
              editingWords={null}
            />
          </View>
        )}

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
    backgroundColor: "#e8e8e8ff",
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  initialContent: {
    alignItems: "center",
    width: "100%",
  },
  addButton: {
    padding: 12,
    borderRadius: 8,
  },
  instructionText: {
    fontSize: 24,
    textAlign: "center",
    width: 320,
    marginTop: 20,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    marginTop: 20,
  },
  successContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
});