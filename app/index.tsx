import { useWords } from "@/context/WordsContext";
import { useRouter } from "expo-router";
import { Plus, RotateCw } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Swiper from "react-native-deck-swiper";
import CardWords from '../components/layout/CardWords.jsx';

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

    const filteredWords = words.filter((word) => !word.favoritar && word.pontuacao === 0);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>...Carregando</Text>
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
                        ? 'Adicione o seu primeiro card'
                        : 'Você chegou ao final da lista'
                    }
                </Text>

                {words.length === 0 && (
                    <TouchableOpacity
                        style={styles.buttonAdd}
                        onPress={() => router.push('/adicionar')}
                    >
                        <Plus size={28} color="#fff" />
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
                    key={filteredWords.length}
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
    },
    wrapper: {
        flex: 1,
        justifyContent: 'center', // centraliza verticalmente
        alignItems: 'center',     // centraliza horizontalmente
    },
    swiperContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flex: 1,
    },
    buttonReset: {
        backgroundColor: '#1acf69ff',
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
        alignSelf: 'center', // centraliza horizontalmente
    },
    buttonAdd: {
        backgroundColor: '#1acf69ff',
        padding: 10,
        borderRadius: 50,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: '40%',
        elevation: 5,
        zIndex: 10,
        alignSelf: 'center', // centraliza horizontalmente
    },
    pontoPositivo: {
        backgroundColor: '#0b9b4aff',
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
        fontWeight: 'bold'
    },
    pontoNegativo: {
        backgroundColor: '#9b0b0bff',
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
        fontWeight: 'bold'
    },
    textoCentral: {
        fontSize: 24,
        textAlign: 'center',
        width: 250
    }
});
