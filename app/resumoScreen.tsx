import { useWords } from '@/context/WordsContext';
import { WordsItem } from '@/types/wordsTypes';
import React from 'react';
import { Dimensions, FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';

// --- Cores e Configuração ---
const BACKGROUND_WHITE = '#FFFFFF';
const ROYAL_BLUE_MAIN = '#00264d';
const GOLD_ACCENT = '#FFC107';
const TEXT_DARK = '#333333';
const LINE_LIGHT = '#EEEEEE';
const BAR_BACKGROUND = '#E0E7FF';

const screenWidth = Dimensions.get('window').width;
const PROGRESS_BAR_MAX_WIDTH = screenWidth * 0.75;

// --- Interface para os itens com erros ---
interface ErroItem {
    palavra: string;
    traducao: string;
    erros: number;
}

// --- Componente da Barra de Progresso Minimalista ---
const MinimalProgressBar = ({ errors, maxErrors }: { errors: number; maxErrors: number }) => {
    const widthPercentage = maxErrors > 0 ? (errors / maxErrors) * 100 : 0;
    const barWidth = Math.max(10, widthPercentage);

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
            <Text style={minimalStyles.errorText}>{errors}x</Text>
        </View>
    );
};

// --- Item da Lista ---
const RenderItem = ({ item }: { item: ErroItem }) => (
    <View style={minimalStyles.listItem}>
        <View style={minimalStyles.textColumn}>
            <Text style={minimalStyles.listTextPalavra}>{item.palavra}</Text>
            <Text style={minimalStyles.listTextTraducao}>{item.traducao}</Text>
        </View>

        <View style={minimalStyles.progressColumn}>
            <MinimalProgressBar errors={item.erros} maxErrors={item.erros} />
        </View>
    </View>
);

// --- Componente Principal ---
export default function ResumoScreen() {
    const { getWordsWithErrors } = useWords();
    
    // Obter palavras com erros do contexto
    const wordsWithErrors = getWordsWithErrors();
    
    // Transformar os dados para o formato usado na lista
    const palavrasMaisErradas: ErroItem[] = wordsWithErrors.map((word: WordsItem) => ({
        palavra: word.title,
        traducao: word.traducao,
        erros: word.pontuacaoErro || 0
    }));

    // Encontrar o máximo de erros para a barra de progresso
    const maxErrors = palavrasMaisErradas.length > 0 
        ? Math.max(...palavrasMaisErradas.map(p => p.erros))
        : 0;

    if (palavrasMaisErradas.length === 0) {
        return (
            <View style={minimalStyles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={BACKGROUND_WHITE} />
                <Text style={minimalStyles.header}>Seu Resumo de Vocabulário</Text>
                <View style={minimalStyles.emptyContainer}>
                    <Text style={minimalStyles.emptyText}>
                        Nenhum erro registrado ainda! 🎉
                    </Text>
                    <Text style={minimalStyles.emptySubText}>
                        Continue praticando para ver seu progresso aqui.
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={minimalStyles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={BACKGROUND_WHITE} />
            
            <Text style={minimalStyles.header}>Seu Resumo de Vocabulário</Text>
            
            <View style={minimalStyles.statsContainer}>
                <View style={minimalStyles.statItem}>
                    <Text style={minimalStyles.statNumber}>{palavrasMaisErradas.length}</Text>
                    <Text style={minimalStyles.statLabel}>Palavras com erro</Text>
                </View>
                <View style={minimalStyles.statItem}>
                    <Text style={minimalStyles.statNumber}>
                        {palavrasMaisErradas.reduce((total, item) => total + item.erros, 0)}
                    </Text>
                    <Text style={minimalStyles.statLabel}>Total de erros</Text>
                </View>
            </View>

            <View style={minimalStyles.sectionTitleContainer}>
                <Text style={minimalStyles.sectionTitle}>Frequência de Erros</Text>
            </View>

            <FlatList
                data={palavrasMaisErradas}
                keyExtractor={(item) => item.palavra}
                renderItem={({ item }) => (
                    <RenderItem item={item} />
                )}
                contentContainerStyle={minimalStyles.listContent}
            />
        </View>
    );
}

// --- Estilos ---
const minimalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_WHITE,
        paddingTop: 50,
    },
    header: {
        fontSize: 26,
        fontWeight: '700',
        color: ROYAL_BLUE_MAIN,
        textAlign: 'center',
        marginBottom: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: 20,
        marginBottom: 30,
        padding: 15,
        backgroundColor: BAR_BACKGROUND,
        borderRadius: 10,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: ROYAL_BLUE_MAIN,
    },
    statLabel: {
        fontSize: 12,
        color: TEXT_DARK,
        marginTop: 5,
    },
    sectionTitleContainer: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: TEXT_DARK,
        marginBottom: 5,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: LINE_LIGHT,
    },
    textColumn: {
        flex: 0.6,
        marginRight: 10,
    },
    listTextPalavra: {
        fontSize: 16,
        color: TEXT_DARK,
        fontWeight: '500',
    },
    listTextTraducao: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    progressColumn: {
        flex: 0.4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    progressBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: PROGRESS_BAR_MAX_WIDTH,
        justifyContent: 'flex-end',
    },
    progressBarBackground: {
        height: 6,
        borderRadius: 3,
        backgroundColor: BAR_BACKGROUND,
        width: '70%',
        marginRight: 10,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: GOLD_ACCENT,
        borderRadius: 3,
    },
    errorText: {
        fontSize: 14,
        color: ROYAL_BLUE_MAIN,
        fontWeight: 'bold',
        minWidth: 25,
        textAlign: 'right',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        fontSize: 18,
        color: TEXT_DARK,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 10,
    },
    emptySubText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
});