import { useWords } from '@/context/WordsContext';
import i18n from '@/locates';
import { WordsItem } from '@/types/wordsTypes';
import React from 'react';
import {
    Dimensions,
    FlatList,
    ListRenderItemInfo,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    View
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

// --- Cores e Configuração ---
const BACKGROUND_WHITE = '#FFFFFF';
const ROYAL_BLUE_MAIN = '#00264d';
const GOLD_ACCENT = '#FFC107';
const TEXT_DARK = '#333333';
const LINE_LIGHT = '#EEEEEE';
const BAR_BACKGROUND = '#E0E7FF';
const SUCCESS_GREEN = '#4CAF50';

const screenWidth = Dimensions.get('window').width;
const PROGRESS_BAR_MAX_WIDTH = screenWidth * 0.75;

// --- Interface para os itens com erros ---
interface ErroItem {
    palavra: string;
    traducao: string;
    erros: number;
}

// --- Altura Fixa do Item ---
const ITEM_HEIGHT = 80;

// --- Componente da Barra de Progresso Melhorada ---
const MinimalProgressBar = ({ errors, maxErrors }: { errors: number; maxErrors: number }) => {
    const effectiveMaxErrors = maxErrors > 0 ? maxErrors : 1;
    const widthPercentage = (errors / effectiveMaxErrors) * 100;
    const barWidth = Math.max(8, widthPercentage);

    return (
        <View style={minimalStyles.progressBarContainer}>
            <View style={minimalStyles.progressBarBackground}>
                <View 
                    style={[
                        minimalStyles.progressBarFill, 
                        { width: `${barWidth}%` }
                    ]}
                />
            </View>
            <View style={minimalStyles.errorBadge}>
                <Text style={minimalStyles.errorText}>{errors}x</Text>
            </View>
        </View>
    );
};

// --- Item da Lista Otimizado ---
const RenderItem = React.memo(({ item, maxErrors }: { item: ErroItem, maxErrors: number }) => (
    <View style={minimalStyles.listItem}>
        <View style={minimalStyles.textColumn}>
            <Text 
                style={minimalStyles.listTextPalavra} 
                numberOfLines={1} 
                ellipsizeMode="tail"
            >
                {item.palavra}
            </Text>
            <Text 
                style={minimalStyles.listTextTraducao} 
                numberOfLines={1} 
                ellipsizeMode="tail"
            >
                {item.traducao}
            </Text>
        </View>

        <View style={minimalStyles.progressColumn}>
            <MinimalProgressBar errors={item.erros} maxErrors={maxErrors} />
        </View>
    </View>
));

// --- Função getItemLayout ---
const getItemLayout = (data: ArrayLike<ErroItem> | null | undefined, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
});

// --- Componente Principal com Melhorias UX/UI ---
export default function ResumoScreen() {
    const { getWordsWithErrors } = useWords();
    
    const wordsWithErrors = getWordsWithErrors();
    
    const palavrasMaisErradas: ErroItem[] = wordsWithErrors.map((word: WordsItem) => ({
        palavra: word.title,
        traducao: word.traducao,
        erros: word.pontuacaoErro || 0
    }));

    const maxErrors = palavrasMaisErradas.length > 0 
        ? Math.max(...palavrasMaisErradas.map(p => p.erros))
        : 0;

    const totalErros = palavrasMaisErradas.reduce((total, item) => total + item.erros, 0);

    const renderItem = React.useCallback(({ item }: ListRenderItemInfo<ErroItem>) => (
        <RenderItem item={item} maxErrors={maxErrors} />
    ), [maxErrors]);

    // Estado vazio melhorado
    if (palavrasMaisErradas.length === 0) {
        return (
            <SafeAreaView style={minimalStyles.safeArea}>
                <StatusBar barStyle="dark-content" backgroundColor={BACKGROUND_WHITE} />
                <View style={minimalStyles.container}>
                    <Text style={minimalStyles.header}>{i18n.t('resumo.titulo')}</Text>
                    <View style={minimalStyles.emptyContainer}>
                        <View style={minimalStyles.successIcon}>
                            <Text style={minimalStyles.successIconText}>✓</Text>
                        </View>
                        <Text style={minimalStyles.emptyText}>
                            {i18n.t('resumo.semErrosTitulo')}
                        </Text>
                        <Text style={minimalStyles.emptySubText}>
                            {i18n.t('resumo.semErrosSubtitulo')}
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={minimalStyles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={BACKGROUND_WHITE} />
            
            <View style={minimalStyles.container}>
                <Text style={minimalStyles.header}>{i18n.t('resumo.titulo')}</Text>
                
                {/* Cards de Estatísticas Melhorados */}
                <View style={minimalStyles.statsContainer}>
                    <View style={[minimalStyles.statCard, minimalStyles.statCardPrimary]}>
                        <Text style={minimalStyles.statNumber}>{palavrasMaisErradas.length}</Text>
                        <Text style={minimalStyles.statLabel}>{i18n.t('resumo.palavrasComErro')}</Text>
                    </View>
                    <View style={[minimalStyles.statCard, minimalStyles.statCardSecondary]}>
                        <Text style={minimalStyles.statNumber}>{totalErros}</Text>
                        <Text style={minimalStyles.statLabel}>{i18n.t('resumo.totalErros')}</Text>
                    </View>
                </View>

                {/* Seção de Frequência com Indicador Visual */}
                <View style={minimalStyles.sectionHeader}>
                    <Text style={minimalStyles.sectionTitle}>{i18n.t('resumo.frequenciaErros')}</Text>
                    <View style={minimalStyles.sectionIndicator} />
                </View>

                {/* Lista com Melhor Scroll */}
                <FlatList
                    data={palavrasMaisErradas}
                    getItemLayout={getItemLayout}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.palavra}
                    contentContainerStyle={minimalStyles.listContent}
                    initialNumToRender={12}
                    maxToRenderPerBatch={15}
                    windowSize={10}
                    showsVerticalScrollIndicator={true}
                    removeClippedSubviews={Platform.OS === 'android'}
                    ListFooterComponent={<View style={minimalStyles.listFooter} />}
                />
            </View>
        </SafeAreaView>
    );
}

// --- Estilos Otimizados para Mobile ---
const minimalStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: BACKGROUND_WHITE,
    },
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_WHITE,
        paddingTop: Platform.OS === 'ios' ? 20 : 40,
    },
    header: {
        fontSize: 28,
        fontWeight: '700',
        color: ROYAL_BLUE_MAIN,
        textAlign: 'center',
        marginBottom: 25,
        paddingHorizontal: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginBottom: 30,
        gap: 15,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    statCardPrimary: {
        backgroundColor: ROYAL_BLUE_MAIN,
    },
    statCardSecondary: {
        backgroundColor: GOLD_ACCENT,
    },
    statNumber: {
        fontSize: 28,
        fontWeight: 'bold',
        color: BACKGROUND_WHITE,
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 13,
        color: BACKGROUND_WHITE,
        textAlign: 'center',
        fontWeight: '500',
        opacity: 0.9,
    },
    sectionHeader: {
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: ROYAL_BLUE_MAIN,
        marginBottom: 8,
    },
    sectionIndicator: {
        width: 40,
        height: 4,
        backgroundColor: GOLD_ACCENT,
        borderRadius: 2,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 0,
        borderBottomWidth: 1,
        borderBottomColor: LINE_LIGHT,
        height: ITEM_HEIGHT - 1,
        minHeight: ITEM_HEIGHT - 1,
    },
    textColumn: {
        flex: 1,
        marginRight: 15,
        justifyContent: 'center',
    },
    listTextPalavra: {
        fontSize: 17,
        color: TEXT_DARK,
        fontWeight: '600',
        marginBottom: 4,
    },
    listTextTraducao: {
        fontSize: 15,
        color: '#666',
        opacity: 0.8,
    },
    progressColumn: {
        width: 120,
        alignItems: 'flex-end',
    },
    progressBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
    },
    progressBarBackground: {
        height: 8,
        borderRadius: 4,
        backgroundColor: BAR_BACKGROUND,
        flex: 1,
        marginRight: 12,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: GOLD_ACCENT,
        borderRadius: 4,
    },
    errorBadge: {
        backgroundColor: ROYAL_BLUE_MAIN,
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        minWidth: 35,
        alignItems: 'center',
    },
    errorText: {
        fontSize: 13,
        color: BACKGROUND_WHITE,
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    successIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: SUCCESS_GREEN,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
    },
    successIconText: {
        fontSize: 36,
        color: BACKGROUND_WHITE,
        fontWeight: 'bold',
    },
    emptyText: {
        fontSize: 22,
        color: ROYAL_BLUE_MAIN,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 12,
        lineHeight: 28,
    },
    emptySubText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        opacity: 0.8,
    },
    listFooter: {
        height: 30,
    },
});