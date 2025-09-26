import { SquarePlus } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Form from '../components/form';


export default function Cards() {
    const [showForm, setShowForm] = useState(false)

    return (
        <View style={styles.container}>
            {!showForm && (
                <View style={{alignItems: 'center'}}>
                    <Pressable
                        onPress={() => setShowForm(!showForm)}
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

                    <Text style={{ fontSize: 24, textAlign: 'center', width: 320 }}>Clique para adicionar uma palavra</Text>

                </View>
            )}
            {showForm && <Form onClose={() => setShowForm(false)} tituloForm={'Insira Uma Nova Palavra'} />}
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
});
