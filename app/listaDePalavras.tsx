import i18n from "@/locates";
import { WordsItem } from "@/types/wordsTypes";
import { useSearchParams } from "expo-router/build/hooks";
import { SquarePen, Trash2 } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Animated, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Form from "../components/layout/form";
import { useWords } from "../context/WordsContext";
import DeleteConfirmation from './../components/layout/DeleteConfirmation';
import Favoritar from './../components/layout/favoritar';


type SwipeableRefs = {
    [key: number]: Swipeable | null;
};

export default function ListaDePalavrasScreen() {
    const { words, loading, handleToggleFavorite, handleDelete } = useWords();
    const [showForm, setShowForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingWords, setEditingWords] = useState<WordsItem | null>(null);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const { setPalavra, setTraducao, categorias } = useWords();
    const [filteredWords, setFilteredWords] = useState<WordsItem[]>([]);


    const searchParams = useSearchParams();
    const categoria = searchParams.get("categoria");

    useEffect(() => {
        if (categoria) {
            const decodedCategoria = decodeURIComponent(categoria);
            setFilteredWords(words.filter(word => word.categoria === decodedCategoria));
        } else {
            setFilteredWords(words);
        }
    }, [categoria, words]);


    const [currentLocale, setCurrentLocale] = useState(i18n.locale);

    useEffect(() => {
        const interval = setInterval(() => {
            if (i18n.locale !== currentLocale) {
                setCurrentLocale(i18n.locale);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [currentLocale]);

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

    const handleDeleteClick = (id: number) => {
        setSelectedItemId(id);
        setShowDeleteModal(true);
    };

    const onConfirmDelete = async () => {
        if (selectedItemId) {
            try {
                await handleDelete(selectedItemId);
            } catch (error) {
                console.error('Erro ao deletar palavra', error);
            } finally {
                setShowDeleteModal(false);
                setSelectedItemId(null);
            }
        }
    };

    const onCancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedItemId(null);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>{i18n.t('mensagemSistema.carregando')}</Text>
            </View>
        );
    }

    if (words.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.emptyListText}>
                    {i18n.t('listaDePalavras.listaVazia')}
                </Text>
            </View>
        );
    }

    const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>, item: WordsItem) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        });

        return (
            <TouchableOpacity
                style={styles.editar}
                onPress={() => {
                    setEditingWords(item); // agora inclui categoria
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
                onPress={() => handleDeleteClick(itemId)}
            >
                <Animated.View style={{ transform: [{ scale }] }}>
                    <Trash2 size={80} color="#FFF" />
                </Animated.View>
            </TouchableOpacity>
        );
    };

    // Garantir que "Sem Categoria" sempre apareça no picker
    const allCategories = categorias.includes("Sem Categoria") ? categorias : ["Sem Categoria", ...categorias];

    return (
        <View style={styles.container} key={currentLocale}>
            {!showForm && (
                <View style={styles.container}>
                    <FlatList
                        data={filteredWords}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <Swipeable
                                ref={(ref) => { if (ref) swipeableRefs.current[item.id] = ref; }}
                                renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}
                                renderLeftActions={(progress, dragX) => renderLeftActions(progress, dragX, item.id)}
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

                    {showDeleteModal && (
                        <View style={styles.overlay}>
                            <DeleteConfirmation
                                title={i18n.t('listaDePalavras.deleteConfirmacaoTitulo')}
                                mensagem={i18n.t('listaDePalavras.deleteConfirmacaoTexto')}
                                onCancel={onCancelDelete}
                                onConfirm={onConfirmDelete}
                            />
                        </View>
                    )}
                </View>
            )}
            {showForm && (
                <Form
                    onClose={() => {
                        setShowForm(false);
                        setEditingWords(null);
                        setPalavra('');
                        setTraducao('');
                    }}
                    tituloForm={i18n.t('listaDePalavras.formTexto')}
                    editingWords={editingWords}
                    allCategories={allCategories}
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
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
    },
    emptyListText: {
        fontSize: 24,
        textAlign: 'center',
        width: 300,
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
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: '100%',
    },
    textoTitle: {
        fontSize: 24,
        textAlign: 'left',
        fontWeight: '600',
        marginBottom: 5,
        flexShrink: 1,
    },
    textoTraducao: {
        fontSize: 18,
        color: '#757575ff',
        flexShrink: 1,
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
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
});