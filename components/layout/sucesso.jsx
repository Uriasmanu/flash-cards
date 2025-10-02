import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function Sucesso() {
    return (
        <View style={styles.success}>
            <View style={styles.successIcon}>
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                    <Path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        fill="#393a37"
                        d="M12 1c-6.075 0-11 4.925-11 11s4.925 11 
            11 11 11-4.925 11-11S18.075 1 12 1zm4.768 9.14c.088-.1.155-.217.197-.344.042-.127.058-.26.048-.393a.96.96 
            0 0 0-.109-.381 1.05 1.05 0 0 0-.248-.309 1.06 1.06 0 0 0-.348-.188 1.04 1.04 
            0 0 0-.394-.038 1.06 1.06 0 0 0-.378.118c-.117.064-.22.15-.303.255l-4.3 
            5.159-2.225-2.226a1.02 1.02 0 0 0-.703-.28c-.262.003-.513.108-.698.293a.99.99 
            0 0 0-.293.698c-.002.262.099.515.281.703l3 3c.098.099.216.175.345.225a1.01 1.01 
            0 0 0 .407.067 1.04 1.04 0 0 0 .399-.104c.124-.062.235-.149.324-.255l4.876-5.85z"
                    />
                </Svg>
            </View>

            <Text style={styles.successTitle}>Registrado com sucesso</Text>

            <TouchableOpacity style={styles.successClose}>
                <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                    <Path
                        fill="#393a37"
                        d="M15.833 5.342 14.658 4.167 10 8.825 5.342 
            4.167 4.167 5.342 8.825 10 4.167 14.658l1.175 1.175L10 
            11.175l4.658 4.658 1.175-1.175L11.175 10l4.658-4.658z"
                    />
                </Svg>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    success: {
        width: '95%',
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#84D65A",
        borderRadius: 8,
        shadowColor: "#111",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    successIcon: {
        width: 20,
        height: 20,
        marginRight: 8,
        transform: [{ translateY: -2 }],
    },
    successTitle: {
        fontWeight: "500",
        fontSize: 14,
        color: "#393A37",
    },
    successClose: {
        width: 20,
        height: 20,
        marginLeft: "auto",
    },
});
