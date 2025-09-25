import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

export default function Index() {
    const floatAnim = useRef(new Animated.Value(0)).current;
    const router = useRouter();
    
    useEffect(() => {
        setTimeout(() => {
            router.replace("/inicio");
        }, 3000)
    }, [])

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: -10,
                    duration: 700,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 700,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [floatAnim]);

    return (
        <View style={styles.container}>
            <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
                <Image
                    source={require('./gummy-notebook.png')}
                    style={styles.logo}
                />
            </Animated.View>
            <View style={styles.sombra}></View>
            <Text style={styles.slogan}>Aprenda de uma forma Divertida</Text>
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
    logo: {
        width: 200,
        height: 150,
    },

    sombra: {
        width: 70,
        height: 10,
        borderRadius: 50,
        backgroundColor: "#f0f0f0ff",
        marginBottom: 15,
    },

    slogan: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold",
        width: 300,
    },
});
