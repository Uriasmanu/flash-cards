import { SquarePen, Trash2 } from "lucide-react-native";
import { useRef, useState } from "react";
import { Animated, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Form from "../components/layout/form";
import { useWords } from "../context/WordsContext";
import DeleteConfirmation from './../components/layout/DeleteConfirmation';
import Favoritar from './../components/layout/favoritar';

// Defina a interface para os itens da lista
interface WordItem {
    id: number;
    title: string;
    traducao: string;
    favoritar: boolean;
}

// Tipo para as referências do Swipeable
type SwipeableRefs = {
    [key: number]: Swipeable | null;
};

export default function ListaDePalavrasScreen() {
    const { words, loading, handleToggleFavorite, handleDelete } = useWords();
    const [showForm, setShowForm] = useState(false);
    const [editingWords, setEditingWords] = useState<WordItem | null>(null);

    // Corrigindo a tipagem do useRef
    const swipeableRefs = useRef<SwipeableRefs>({});

    const closeOuthers = (id: number) => {
        Object.keys(swipeableRefs.current).forEach((key) => {
            const numericKey = Number(key);
            if (numericKey !== id && swipeableRefs.current[numericKey]) {
                swipeableRefs.current[numericKey]?.close();
            }
        });
    };

    const sortedWords = [...words].sort((a, b) =>
        a.title.localeCompare(b.title, 'pt-BR', { sensitivity: 'base' })
    );

    if (loading) {
        return (
            <View>
                <Text>...Carregando</Text>
            </View>
        );
    }

    if (words.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={{ fontSize: 24, textAlign: 'center', width: 300 }}>
                    Você ainda não tem palavras cadastradas
                </Text>
            </View>
        );
    }

    const onDelete = async (id: number) => {
        try {
            await handleDelete(id);
            console.log('Palavra deletada com sucesso');
        } catch (error) {
            console.error('Erro ao deletar palavra', error);
        }
    };

    const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>, item: WordItem) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        });

        return (
            <TouchableOpacity
                style={styles.editar}
                onPress={() => {
                    setEditingWords(item);
                    setShowForm(true);
                }}
            >
                <Animated.View style={{ transform: [{ scale }] }}>
                    <SquarePen size={50} color="#000" />
                </Animated.View>
            </TouchableOpacity>
        );
    };

    const renderLeftActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>, itemId: number) => {
        const scale = dragX.interpolate({
            inputRange: [0, 100],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        });

        return (
            <TouchableOpacity
                style={styles.apagar}
                onPress={() => onDelete(itemId)}
            >
                <Animated.View style={{ transform: [{ scale }] }}>
                    <Trash2 size={80} color="#FFF" />
                </Animated.View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {!showForm && (
                <View style={styles.container}>

                    <FlatList
                        data={sortedWords}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <Swipeable
                                ref={(ref) => {
                                    if (ref) {
                                        swipeableRefs.current[item.id] = ref;
                                    }
                                }}
                                renderRightActions={(progress, dragX) =>
                                    renderRightActions(progress, dragX, item)
                                }
                                renderLeftActions={(progress, dragX) =>
                                    renderLeftActions(progress, dragX, item.id)
                                }
                                onSwipeableWillOpen={() => closeOuthers(item.id)}
                                rightThreshold={40}
                                leftThreshold={40}
                                friction={2}
                            >
                                <View style={styles.ItemsList}>
                                    <View style={styles.containerLeft}>
                                        <View>
                                            <Text style={styles.textoTitle}>{item.title}</Text>
                                            <Text style={styles.textoTraducao}>{item.traducao}</Text>
                                        </View>
                                    </View>
                                    <Favoritar
                                        initialChecked={item.favoritar}
                                        onChange={() => handleToggleFavorite(item.id)}
                                    />
                                </View>
                            </Swipeable>
                        )}
                        ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                    />
                    <DeleteConfirmation title={'Você Tem Certeza?'} mensagem={"Tem certeza que quer apagar?"}/>
                </View>
            )}
            {showForm && (
                <Form
                    onClose={() => {
                        setShowForm(false);
                        setEditingWords(null);
                    }}
                    tituloForm={'Editar Palavra'}
                    editingWords={editingWords}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: 'center',
        gap: 20,
        padding: 10,
        height: '98%',
    },

    containerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },

    ItemsList: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        gap: 10,
        minHeight: 50,
        maxHeight: 90,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        width: '100%'
    },

    textoTitle: {
        fontSize: 24,
        textAlign: 'left',
        width: 300,
        fontWeight: '600', // Corrigido: string em vez de number
        marginLeft: 10
    },

    textoTraducao: {
        fontSize: 18,
        color: '#757575ff',
        marginLeft: 10,
        marginVertical: 5
    },

    apagar: {
        backgroundColor: '#F81111',
        height: '100%',
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },

    editar: {
        backgroundColor: '#FFD501',
        height: '100%',
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
});