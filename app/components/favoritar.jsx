import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function Favoritar({ initialChecked, onChange }) {
    const [isChecked, setIsChecked] = useState(initialChecked);

    useEffect(() => {
        setIsChecked(initialChecked);
    }, [initialChecked]);

    const toggleCheckbox = () => {
        const newValue = !isChecked;
        setIsChecked(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <View style={styles.checkboxCon}>
            <TouchableOpacity 
                style={[
                    styles.container,
                    isChecked && styles.containerChecked
                ]}
                onPress={toggleCheckbox}
                activeOpacity={0.7}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={isChecked ? "#ffee02ff" : "none"}
                    viewBox="0 0 75 100"
                    style={styles.pin}
                >
                    <line
                        strokeWidth="12"
                        stroke={isChecked ? "#000000ff" : "black"}
                        y2="100"
                        x2="37"
                        y1="64"
                        x1="37"
                    />
                    <path
                        strokeWidth="10"
                        stroke={isChecked ? "#000000ff" : "black"}
                        d="M16.5 36V4.5H58.5V36V53.75V54.9752L59.1862 55.9903L66.9674 67.5H8.03256L15.8138 55.9903L16.5 54.9752V53.75V36Z"
                    />
                </svg>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    checkboxCon: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        width: 60,
        height: 60,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    containerChecked: {
        backgroundColor: '#fff',
    },
    pin: {
        width: 15,
        height: 'auto',
        transform: [{ rotate: '35deg' }],
    },
});