import { useState } from "react";
import { Animated, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Favoritar from './favoritar';

import iconeCard from '../../assets/images/cardIcon.png';


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
                        <Image source={iconeCard} style={{ width: 300, height: 300 }} />
                        <ScrollView style={styles.titleWrapper}>
                            <Text style={styles.title}>{titulo}</Text>
                        </ScrollView>
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
                        <Text style={styles.description}>{traducao}</Text>
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
        marginTop: 20,
        marginHorizontal: 10,
        borderColor: '#b8860b'

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
    },
    flipCardBack: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1a1a1a",
        borderWidth: 1,
        borderColor: "coral",
        borderRadius: 16,
        padding: 10,
    },

    titleWrapper: {
        maxHeight: 150,
        width: '100%',
        overflow: 'hidden',

    },

    title: {
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 10
    },

    description: {
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 10,
        color: '#faf0e6'
    },

    favoritar: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 300
    }
});
