import i18n from "@/locates";
import { WordsItem } from "@/types/wordsTypes";
import { useRouter, useSearchParams } from "expo-router/build/hooks";
import { Plus, SquarePen, Trash2 } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Animated, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Form from "../components/layout/form";
import { useWords } from "../context/WordsContext";
import DeleteConfirmation from './../components/layout/DeleteConfirmation';
import Favoritar from './../components/layout/favoritar';

// --- Cores e Design System (Consistente com a tela de Configurações) ---
const COLORS = {
    PRIMARY: '#2563EB', // Azul Principal
    PRIMARY_DARK: '#1D4ED8',
    BACKGROUND: '#FFFFFF',
    BACKGROUND_GRAY: '#F8FAFC', // Fundo da Tela
    CARD_BACKGROUND: '#FFFFFF', // Cor dos Itens da Lista
    TEXT_PRIMARY: '#1E293B',
    TEXT_SECONDARY: '#64748B', // Cor da Tradução/Hint
    BORDER: '#E2E8F0',
    SUCCESS: '#10B981',
    WARNING: '#FFD501', // Amarelo para Edição
    ERROR: '#EF4444', // Vermelho para Exclusão
};

type SwipeableRefs = {
    [key: number]: Swipeable | null;
};

export default function ListaDePalavrasScreen() {
    const { words, loading, handleToggleFavorite, handleDelete, setPalavra, setTraducao, categorias } = useWords();
    const [showForm, setShowForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingWords, setEditingWords] = useState<WordsItem | null>(null);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [filteredWords, setFilteredWords] = useState<WordsItem[]>([]);
    const [search, setSearch] = useState("");

    const router = useRouter();
    const searchParams = useSearchParams();
    const categoria = searchParams.get("categoria");

    // Efeito de Filtro
    useEffect(() => {
        let filtered = words;

        if (categoria) {
            const decodedCategoria = decodeURIComponent(categoria);
            filtered = filtered.filter(word => {
                const cat = word.categoria && word.categoria.trim() !== "" ? word.categoria : "Sem Categoria";
                return cat === decodedCategoria;
            })
        }

        if (search.trim() !== "") {
            filtered = filtered.filter(word =>
                word.title.toLowerCase().includes(search.toLowerCase()) ||
                word.traducao.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilteredWords(filtered);
    }, [search, words, categoria]);

    const swipeableRefs = useRef<SwipeableRefs>({});

    // Função para fechar outros itens quando um é aberto (Melhor UX para Swipeable)
    const closeOuthers = (id: number) => {
        Object.keys(swipeableRefs.current).forEach((key) => {
            const numericKey = Number(key);
            if (numericKey !== id && swipeableRefs.current[numericKey]) {
                swipeableRefs.current[numericKey]?.close();
            }
        });
    };

    const handleDeleteClick = (id: number) => {
        setSelectedItemId(id);
        setShowDeleteModal(true);
        closeOuthers(id); // Fecha o swipeable após a ação
    };

    const onConfirmDelete = async () => {
        if (selectedItemId) {
            await handleDelete(selectedItemId);
            setShowDeleteModal(false);
            setSelectedItemId(null);
        }
    };

    const onCancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedItemId(null);
    };

    const handleEditClick = (item: WordsItem) => {
        setEditingWords(item);
        setShowForm(true);
        closeOuthers(item.id); // Fecha o swipeable após a ação
    };


    // --- Renderização das Ações de Swipe (Direita - Editar) ---
    const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>, item: WordsItem) => {
        const scale = dragX.interpolate({
            inputRange: [-80, -40, 0],
            outputRange: [1, 0.8, 0],
            extrapolate: 'clamp'
        });

        const opacity = dragX.interpolate({
            inputRange: [-80, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View style={[styles.actionWrapperRight, { opacity }]}>
                <TouchableOpacity
                    style={styles.editar}
                    onPress={() => handleEditClick(item)}
                >
                    <Animated.View style={{ transform: [{ scale }], alignItems: 'center' }}>
                        <SquarePen size={28} color={COLORS.TEXT_PRIMARY} />
                        <Text style={styles.actionText}>Editar</Text>
                    </Animated.View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    // --- Renderização das Ações de Swipe (Esquerda - Apagar) ---
    const renderLeftActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>, itemId: number) => {
        const scale = dragX.interpolate({
            inputRange: [0, 40, 80],
            outputRange: [0, 0.8, 1],
            extrapolate: 'clamp'
        });

        const opacity = dragX.interpolate({
            inputRange: [0, 80],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View style={[styles.actionWrapperLeft, { opacity }]}>
                <TouchableOpacity
                    style={styles.apagar}
                    onPress={() => handleDeleteClick(itemId)}
                >
                    <Animated.View style={{ transform: [{ scale }], alignItems: 'center' }}>
                        <Trash2 size={28} color="#FFF" />
                        <Text style={[styles.actionText, { color: '#FFF' }]}>Apagar</Text>
                    </Animated.View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    // Exibição de Loading e Lista Vazia
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={{ color: COLORS.TEXT_PRIMARY }}>{i18n.t('mensagemSistema.carregando')}</Text>
            </View>
        );
    }

    if (words.length === 0 && !categoria) {
        return (
            <View style={styles.contentContainer}>
                <Text style={styles.emptyListText}>
                    {i18n.t('listaDePalavras.listaVazia')}
                </Text>
                <TouchableOpacity
                    style={styles.bigAddButton}
                    onPress={() => router.push('/adicionar')}
                >
                    <Plus color={COLORS.BACKGROUND} size={30} />
                    <Text style={styles.bigAddButtonText}>Adicionar Palavra</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.mainWrapper} key={i18n.locale}>
            {!showForm && (
                <View style={styles.contentContainer}>
                    {/* Título da Categoria */}
                    {categoria && (
                        <Text style={styles.categoryTitle}>{decodeURIComponent(categoria)}</Text>
                    )}

                    {/* Barra de Busca e Botão Adicionar */}
                    <View style={styles.headerControls}>
                        <TextInput
                            placeholder={i18n.t('listaDePalavras.buscarPlaceholder')}
                            placeholderTextColor={COLORS.TEXT_SECONDARY}
                            style={styles.input}
                            onChangeText={setSearch}
                            value={search}
                        />

                        <TouchableOpacity
                            style={styles.adicionar}
                            onPress={() => router.push('/adicionar')}
                        >
                            <Plus color={COLORS.BACKGROUND} size={24} />
                        </TouchableOpacity>
                    </View>

                    {/* Mensagem de Filtro Vazio */}
                    {filteredWords.length === 0 && (
                        <View style={styles.emptyFilterContainer}>
                            <Text style={styles.emptyFilterText}>
                                {i18n.t('listaDePalavras.semResultado')}
                            </Text>
                        </View>
                    )}

                    {/* Lista de Palavras */}
                    <FlatList
                        data={filteredWords}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => (
                            <Swipeable
                                ref={(ref) => { if (ref) swipeableRefs.current[item.id] = ref; }}
                                renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}
                                renderLeftActions={(progress, dragX) => renderLeftActions(progress, dragX, item.id)}
                                onSwipeableWillOpen={() => closeOuthers(item.id)}
                                rightThreshold={80} // Ajustado para o novo tamanho
                                leftThreshold={80} // Ajustado para o novo tamanho
                                friction={2}
                            >
                                <View style={styles.ItemsList}>
                                    <View style={styles.containerLeft}>
                                        <Text style={styles.textoTitle}>{item.title}</Text>
                                        <Text style={styles.textoTraducao}>{item.traducao}</Text>
                                    </View>
                                    <Favoritar
                                        initialChecked={item.favoritar}
                                        onChange={() => handleToggleFavorite(item.id)}
                                    />
                                </View>
                            </Swipeable>
                        )}
                        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
                    />

                    {/* Modal de Confirmação de Exclusão (Overlay) */}
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

            {/* Formulário de Edição/Adição (Modal/Full Screen) */}
            {showForm && (
                <Form
                    onClose={() => {
                        setShowForm(false);
                        setEditingWords(null);
                        setPalavra('');
                        setTraducao('');
                    }}
                    tituloForm={editingWords ? i18n.t('listaDePalavras.formEditar') : i18n.t('listaDePalavras.formAdicionar')}
                    editingWords={editingWords}
                    allCategories={["Sem Categoria", ...categorias.filter(c => c !== "Sem Categoria")]}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND_GRAY, // Fundo cinza suave
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20, // Padding lateral para a tela
        paddingTop: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: COLORS.BACKGROUND_GRAY,
    },
    // --- Título da Categoria ---
    categoryTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.PRIMARY_DARK,
        marginBottom: 15,
    },
    // --- Header (Busca e Botão) ---
    headerControls: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        backgroundColor: COLORS.CARD_BACKGROUND,
        paddingVertical: 14, // Padding menor para deixar mais compacto
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 16,
        fontWeight: "500",
        color: COLORS.TEXT_PRIMARY,
        borderWidth: 1,
        borderColor: COLORS.BORDER,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
        marginRight: 12, // Espaço entre o input e o botão
    },
    adicionar: {
        backgroundColor: COLORS.PRIMARY, // Azul consistente
        padding: 12,
        borderRadius: 50, // Completamente circular
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        shadowColor: COLORS.PRIMARY_DARK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    // --- Lista e Itens ---
    listContent: {
        paddingBottom: 40,
    },
    itemSeparator: {
        height: 10, // Aumento de 5 para 10 para um visual mais clean
    },
    ItemsList: {
        backgroundColor: COLORS.CARD_BACKGROUND,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15, // Aumento do padding interno
        paddingHorizontal: 15,
        borderRadius: 12, // Borda arredondada (Card)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    containerLeft: {
        flex: 1,
        marginRight: 15,
    },
    textoTitle: {
        fontSize: 20, // Ajustado para ser menos dominante
        fontWeight: '700',
        color: COLORS.TEXT_PRIMARY,
        marginBottom: 2,
    },
    textoTraducao: {
        fontSize: 16,
        color: COLORS.TEXT_SECONDARY, // Cinza consistente
    },
    // --- Ações de Swipe (Redesenhadas) ---
    actionWrapperRight: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
        paddingLeft: 10,
    },
    actionWrapperLeft: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
        paddingRight: 10,
    },
    apagar: {
        backgroundColor: COLORS.ERROR,
        width: '100%',
        height: '95%', // Ajuste para que o item "encaixe"
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12, // Consistente com os Cards
    },
    editar: {
        backgroundColor: COLORS.WARNING,
        width: '100%',
        height: '95%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    actionText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.TEXT_PRIMARY,
        marginTop: 4,
        textAlign: 'center',
    },
    // --- Estados Vazios ---
    emptyListText: {
        fontSize: 18,
        textAlign: 'center',
        color: COLORS.TEXT_SECONDARY,
        marginBottom: 30,
        paddingHorizontal: 40,
    },
    emptyFilterContainer: {
        alignItems: 'center',
        marginTop: 50,
        flex: 1,
    },
    emptyFilterText: {
        fontSize: 16,
        color: COLORS.TEXT_SECONDARY,
    },
    bigAddButton: {
        backgroundColor: COLORS.PRIMARY,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        elevation: 5,
        shadowColor: COLORS.PRIMARY_DARK,
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    bigAddButtonText: {
        color: COLORS.BACKGROUND,
        fontSize: 18,
        fontWeight: '600',
    },
    // --- Modal Overlay ---
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
});