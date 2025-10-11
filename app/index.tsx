// app/index.tsx
import { useWords } from "@/context/WordsContext";
import { useRouter } from "expo-router";
import { Plus, RotateCw } from "lucide-react-native";
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Swiper from "react-native-deck-swiper";
import CardWords from '../components/layout/CardWords.jsx';
import i18n from '../locates/index';

export default function InicioScreen() {
    const { 
        words, 
        loading, 
        handleToggleFavorite, 
        handlePontuacao, 
        handleResetPontuacao, 
        countPontuacaoPositive, 
        countPontuacaoNegative 
    } = useWords();
    const router = useRouter();
    
    // Estado para forçar o rerender quando o idioma mudar
    const [currentLocale, setCurrentLocale] = useState(i18n.locale);

    const filteredWords = words.filter((word) => !word.favoritar && word.pontuacao === 0);

    // Escutar mudanças de idioma
    useEffect(() => {
        const updateLocale = () => {
            setCurrentLocale(i18n.locale);
        };

        const interval = setInterval(() => {
            if (i18n.locale !== currentLocale) {
                setCurrentLocale(i18n.locale);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [currentLocale]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>{i18n.t('mensagemSistema.carregando')}</Text>
            </View>
        )
    }

    if (filteredWords.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.pontoPositivo}>{countPontuacaoPositive()}</Text>
                <Text style={styles.pontoNegativo}>{countPontuacaoNegative()}</Text>

                <Text style={styles.textoCentral}>
                    {words.length === 0
                        ? i18n.t('index.adicionarCard')
                        : i18n.t('index.finalLista')
                    }
                </Text>

                {words.length === 0 && (
                    <TouchableOpacity
                        style={styles.buttonAdd}
                        onPress={() => router.push('/adicionar')}
                    >
                        <Plus size={35} color="#fff" />
                    </TouchableOpacity>
                )}

                {words.length > 0 && (
                    <TouchableOpacity
                        style={styles.buttonReset}
                        onPress={handleResetPontuacao}
                    >
                        <RotateCw size={28} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            <Text style={styles.pontoPositivo}>{countPontuacaoPositive()}</Text>
            <Text style={styles.pontoNegativo}>{countPontuacaoNegative()}</Text>

            <View style={styles.swiperContainer}>
                <Swiper
                    key={filteredWords.length + currentLocale} // Adiciona locale na key para forçar rerender
                    cards={filteredWords}
                    renderCard={(item) => (
                        <CardWords
                            id={item.id}
                            favoritar={item.favoritar}
                            titulo={item.title}
                            traducao={item.traducao}
                            onToggleFavorite={handleToggleFavorite}
                            pontuacao={item.pontuacao}
                        />
                    )}
                    cardIndex={0}
                    backgroundColor="transparent"
                    stackSize={3}
                    stackSeparation={15}
                    verticalSwipe={false}
                    onSwipedRight={(index) => {
                        const card = filteredWords[index];
                        if (card) handlePontuacao(card.id, +1);
                    }}
                    onSwipedLeft={(index) => {
                        const card = filteredWords[index];
                        if (card) handlePontuacao(card.id, -1);
                    }}
                />
            </View>

            <TouchableOpacity
                style={styles.buttonReset}
                onPress={handleResetPontuacao}
            >
                <RotateCw size={30} color="#fff" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: "#f6f6f68a",
    },
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    swiperContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flex: 1,
    },
    buttonReset: {
        backgroundColor: '#120a8f',
        padding: 10,
        borderRadius: 50,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        elevation: 5,
        zIndex: 10,
        alignSelf: 'center',
    },
    buttonAdd: {
        backgroundColor: '#1acf69ff',
        padding: 10,
        borderRadius: 50,
        width: 90,
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20, 
        right: 20, 
        elevation: 5,
        zIndex: 10,
    },
    pontoPositivo: {
        backgroundColor: '#556b2f',
        padding: 10,
        borderBottomEndRadius: 20,
        borderRadius: 5,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 5,
        right: 0,
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
        marginRight: 5
    },
    pontoNegativo: {
        backgroundColor: '#b93939ff',
        padding: 10,
        borderRadius: 5,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 5,
        left: 0,
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
        marginLeft: 5
    },
    textoCentral: {
        fontSize: 24,
        textAlign: 'center',
        width: 250
    }
});