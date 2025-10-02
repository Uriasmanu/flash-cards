import { SquarePlus } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Form from "../components/layout/form";
import Sucesso from './../components/layout/sucesso';

export default function CardsScreen() {
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCloseForm = () => {
    setShowForm(false);
    setShowSuccess(true);

    // esconde depois de 2s
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {!showForm && (
        <View style={{ alignItems: "center" }}>
          <Pressable
            onPress={() => setShowForm(true)}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "#f5f5f5" : "#ccc",
                padding: 12,
                borderRadius: 8,
              },
            ]}
          >
            <SquarePlus color="black" size={80} />
          </Pressable>

          <Text
            style={{
              fontSize: 24,
              textAlign: "center",
              width: 320,
              marginTop: 20,
            }}
          >
            Clique para adicionar uma palavra
          </Text>
        </View>
      )}

      {showForm && (
        <Form
          onClose={handleCloseForm}
          tituloForm={"Insira Uma Nova Palavra"}
          editingWords={null}
        />
      )}

      {/* Mensagem de sucesso só aparece se showSuccess for true */}
      {showSuccess && (
        <View style={styles.successContainer}>
          <Sucesso />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
  },
  successContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
});
