import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function BotaoTraduzir() {
return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={[
                    styles.buttonWithIcon,
                ]}
                activeOpacity={0.7}
            >
                <View style={styles.iconContainer}>
                    <Svg
                        width={24}
                        height={24}
                        viewBox="0 0 48 48"
                    >
                        <Path
                            fill="#ffffff"
                            d="M12 39c-.549 0-1.095-.15-1.578-.447A3.008 3.008 0 0 1 9 36V12c0-1.041.54-2.007 1.422-2.553a3.014 3.014 0 0 1 2.919-.132l24 12a3.003 3.003 0 0 1 0 5.37l-24 12c-.42.21-.885.315-1.341.315z"
                        />
                    </Svg>
                </View>
                <Text style={styles.text}>Tradução</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#0f988e',
        paddingHorizontal: 12,
        paddingVertical: 10,
        width: 120,
        height: 40,
        borderRadius: 3,
        backgroundColor: '#15ccbe',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        transform: [{ translateY: 0 }],
    },
    buttonPressed: {
        transform: [{ translateY: 3 }],
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        elevation: 3,
    },
    iconContainer: {
        marginRight: 8,
        width: 24,
        height: 24,
    },
    text: {
        color: 'white',
        fontSize: 14,
        textTransform: 'uppercase',
        fontWeight: 'normal',
    },
});