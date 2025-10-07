import { Trash2 } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DeleteConfirmation({ title, mensagem, onCancel, onConfirm }) {

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Text style={styles.iconContainer}><Trash2 size={40} color={'#fff'} /></Text>

                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.mensagem}>{mensagem}</Text>
                </View>
                <View style={styles.Containerbuttons}>
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onCancel}
                        >
                            <Text
                                style={styles.cancelButtonText}
                            >
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={onConfirm}
                        >
                            <Text
                                style={styles.confirmButtonText}
                            >
                                Confirmar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff4a',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },

    content: {
        backgroundColor: '#1f2937',
        borderWidth: 1,
        borderColor: '#1f2937',
        borderRadius: 16,
        padding: 16,
        width: 300,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    iconContainer: {
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 8
    },

    textContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },

    title: {
        fontSize: 20,
        fontFamily: 'System',
        fontWeight: 'bold',
        color: '#f9fafb',
        marginBottom: 8,
        textAlign: 'center'
    },
    mensagem: {
        fontSize: 14,
        fontFamily: 'System',
        fontWeight: '600',
        color: '#9ca3af',
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 8
    },
    Containerbuttons: {
        gap: 15
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 8
    },
    cancelButton: {
        backgroundColor: '#374151',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#4b5563',
        flex: 1,
        marginRight: 12,
        alignItems: 'center'
    },

    cancelButtonText: {
        color: '#e5e7eb',
        fontSize: 16,
        fontWeight: '600',
        cursor: 'pointer'
    },

    confirmButton: {
        backgroundColor: '#dc2626',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#dc2626',
        flex: 1,
        marginRight: 12,
        alignItems: 'center'
    },

    confirmButtonText: {
        color: '#e5e7eb',
        fontSize: 16,
        fontWeight: '600'
    },
});