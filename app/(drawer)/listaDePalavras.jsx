import { SquarePen, Trash2 } from "lucide-react-native";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import Favoritar from "../components/favoritar";
import { useWords } from "../context/WordsContext";


export default function ListaDePalavras() {

    const { words, loading, handleToggleFavorite } = useWords();

    if (loading) {
        return (
            <View>
                <Text>...Carregando</Text>
            </View>
        )
    };

    if (words.length === 0) {

        return (
            <View style={styles.container}>
                <Text style={{ fontSize: 24, textAlign: 'center', width: 250 }}>Você ainda não tem palavras cadastradas</Text>
            </View>
        );
    };

    const renderRightActions = (progress, dragX, itemId) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        });

        return (
            <TouchableOpacity
                style={styles.editar}
            >
                <Animated.View style={{ transform: [{ scale }] }}>
                    <SquarePen size={30} />
                </Animated.View>
            </TouchableOpacity>
        )
    }

    const renderLeftActions = (progress, dragX, itemId) => {
        const scale = dragX.interpolate({
            inputRange: [0, 100],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        });

        return (
            <TouchableOpacity
                style={styles.apagar}
            >
                <Animated.View style={{ transform: [{ scale }] }}>
                    <Trash2 size={30} />
                </Animated.View>
            </TouchableOpacity>
        )
    };

    let swipeableRef = null;

    const closeSwipeable = () => {
        if (swipeableRef) {
            swipeableRef.close();
        }
    };

    return (
        <View style={styles.container}>
            <Text style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold' }}>Lista de Palavras</Text>
            <FlatList
                data={words}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Swipeable
                        ref={(ref) => swipeableRef = ref}
                        renderRightActions={(progress, dragX) =>
                            renderRightActions(progress, dragX, item.id)
                        }

                        renderLeftActions={(progress, dragX) =>
                            renderLeftActions(progress, dragX, item.id)
                        }
                        onSwipeableWillOpen={closeSwipeable}
                        rightThreshold={40}
                        leftThreshold={40}
                        friction={2}
                    >
                        <View style={styles.ItemsList}>
                            <View style={styles.containerLeft}>
                                <View>
                                    <Text style={{ fontSize: 24, textAlign: 'left', width: 300, fontWeight: 'semibold', marginLeft: 10 }}>{item.title}</Text>
                                    <Text style={{ fontSize: 18, color: '#757575ff', marginLeft: 10, marginVertical:5 }}>{item.traducao}</Text>
                                </View>
                            </View>
                            <Favoritar
                                initialChecked={item.favoritar}
                                onChange={() => handleToggleFavorite(item.id)}
                                style={{ alignItems: 'center' }}
                            />

                        </View>
                    </Swipeable>
                )}

                ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
            />

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        gap: 20,
        padding: 10,
        height: '90vh',

    },

    containerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },

    apagar: {
        backgroundColor: '#F81111',
        height: 70,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },

    editar: {
        backgroundColor: '#FFD501',
        height: 70,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },

    ItemsList: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        gap: 10,
        height: 'auto',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10
    }
})