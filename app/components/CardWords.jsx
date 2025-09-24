import { Languages } from "lucide-react-native";
import { useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import Favoritar from './favoritar';


export default function CardWords({ id, favoritar, titulo, traducao, pontuacao, onToggleFavorite }) {
    const [flipped, setFlipped] = useState(false);
    const rotateAnim = useState(new Animated.Value(0))[0];

    const flipCard = () => {
        Animated.spring(rotateAnim, {
            toValue: flipped ? 0 : 180,
            useNativeDriver: true,
            friction: 8,
            tension: 10,
        }).start();
        setFlipped(!flipped);
    };

    const frontInterpolate = rotateAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ["0deg", "180deg"],
    });

    const backInterpolate = rotateAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ["180deg", "360deg"],
    });

    return (
        <Pressable onPress={flipCard}>
            <View style={styles.flipCard}>
                <View style={styles.favoritar}>
                    <Favoritar
                        onChange={() => onToggleFavorite(id)}
                        initialChecked={favoritar}
                    />
                </View>
                <Animated.View
                    style={[
                        styles.flipCardInner,
                        { transform: [{ rotateY: frontInterpolate }] },
                    ]}
                >
                    <View style={styles.flipCardFront}>
                        <Languages style={{ width: 90, height: 90 }} />
                        <Text style={styles.title}>{titulo}</Text>
                    </View>
                </Animated.View>
                <Animated.View
                    style={[
                        styles.flipCardInner,
                        styles.flipCardBackWrapper,
                        { transform: [{ rotateY: backInterpolate }] },
                    ]}
                >
                    <View style={styles.flipCardBack}>
                        <Text style={styles.title}>{traducao}</Text>
                    </View>
                </Animated.View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    flipCard: {
        perspective: 1000,
        flexDirection: 'column',
        borderWidth: 2,
        borderRadius: 14,
        height: 500,
        width: 320,

    },
    flipCardInner: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backfaceVisibility: "hidden",
    },
    flipCardBackWrapper: {
        top: 0,
    },
    flipCardFront: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "coral",
        borderRadius: 16,
        padding: 10,
        gap: 40
    },
    flipCardBack: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#566752ff",
        borderWidth: 1,
        borderColor: "coral",
        borderRadius: 16,
        padding: 10,
    },

    title: {
        fontSize: 30
    },

    favoritar: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 300
    }
});
