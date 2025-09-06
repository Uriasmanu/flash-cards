import { SquarePlus } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Cards() {
    return (
        <View style={styles.container}>
            <Pressable
                style={({ pressed }) => [
                    {
                        backgroundColor: pressed ? "#f5f5f5" : "#fff",
                        padding: 12,
                        borderRadius: 8,
                    },
                ]}
            >
                <SquarePlus color="black" size={80} />
            </Pressable>

            <Text style={{ fontSize: 24, textAlign: 'center', width: 320 }}>Clique para adicionar uma palavra</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
});
