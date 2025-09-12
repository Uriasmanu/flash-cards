import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Favoritar({ initialChecked = false, onChange }) {
    const [isChecked, setIsChecked] = useState(initialChecked);

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
                    styles.checkbox,
                    isChecked && styles.checkboxChecked
                ]}
                onPress={toggleCheckbox}
            >
                <View style={[
                    styles.checkboxIndicator,
                    isChecked && styles.checkboxIndicatorChecked
                ]}>
                    {isChecked ? (
                        <Text style={styles.checkIcon}>✓</Text>
                    ) : (
                        <Text style={styles.xIcon}>✕</Text>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    checkboxCon: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
    checkbox: {
        width: 48,
        height: 27,
        borderWidth: 2,
        borderColor: '#ff0000',
        borderRadius: 20,
        backgroundColor: '#f1e1e1',
        justifyContent: 'center',
        padding: 2,
    },
    checkboxChecked: {
        borderColor: '#02c202',
        backgroundColor: '#e2f1e1',
    },
    checkboxIndicator: {
        width: 18,
        height: 18,
        borderRadius: 15,
        backgroundColor: 'rgba(234, 7, 7, 0.5)',
        borderWidth: 2,
        borderColor: '#ea0707',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    checkboxIndicatorChecked: {
        backgroundColor: 'rgba(2, 194, 2, 0.5)',
        borderColor: '#02c202',
        alignSelf: 'flex-end',
    },
    checkIcon: {
        color: '#02c202',
        fontSize: 12,
        fontWeight: 'bold',
    },
    xIcon: {
        color: '#ea0707',
        fontSize: 12,
        fontWeight: 'bold',
    },
    label: {
        marginLeft: 10,
        color: 'white',
        fontSize: 14,
    },
});