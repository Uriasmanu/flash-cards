import { useWords } from "@/context/WordsContext";
import { useRouter } from "expo-router";
import { Plus, RotateCw } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Swiper from "react-native-deck-swiper";
import CardWords from '../components/layout/CardWords.jsx';


export default function InicioScreen() {

    const { words, loading, handleToggleFavorite, handlePontuacao, handleResetPontuacao, countPontuacaoPositive, countPontuacaoNegative } = useWords();
    const router = useRouter();

    const filteredWords = words
        .filter((word) => !word.favoritar && word.pontuacao === 0)

    if (loading) {
        return (
            <View>
                <Text>...Carregando</Text>
            </View>
        )
    }

    if (filteredWords.length === 0) {

        return (
            <View style={styles.container}>
                <Text
                    style={styles.pontoPositivo}
                >
                    {countPontuacaoPositive()}
                </Text>
                <Text
                    style={styles.pontoNetivo}
                >
                    {countPontuacaoNegative()}
                </Text>

                <Text style={styles.textoCentral}>
                    {words.length === 0
                        ? 'Adicione o seu primeiro card'
                        : 'Voce chegou ao final da lista'
                    }
                </Text>

                {words.length === 0 && (
                    <TouchableOpacity
                        style={styles.buttonAdd}
                        onPress={() => router.push('/adicionar')}
                    >
                        <Plus size={28} />
                    </TouchableOpacity>
                )}

                {words.length > 0 && (
                    <TouchableOpacity
                        style={styles.buttonReset}
                        onPress={handleResetPontuacao}
                    >
                        <RotateCw size={28} />
                    </TouchableOpacity>
                )}

            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            <Text
                style={styles.pontoPositivo}
            >
                {countPontuacaoPositive()}
            </Text>
            <Text
                style={styles.pontoNetivo}
            >
                {countPontuacaoNegative()}
            </Text>
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
                    if (card) {
                        handlePontuacao(card.id, +1)
                    }
                }}
                onSwipedLeft={(index) => {
                    const card = filteredWords[index];
                    if (card) {
                        handlePontuacao(card.id, -1)
                    }
                }}
            />
            <TouchableOpacity
                style={styles.buttonReset}
                onPress={handleResetPontuacao}
            >
                <RotateCw size={30} />
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: 'center',
        height: '90%',
        marginHorizontal: 10,
    },

    wrapper: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },

    buttonReset: {
        backgroundColor: '#1acf69ff',
        padding: 10,
        borderRadius: 50,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignContent: 'center',
        position: 'absolute',
        bottom: 5,
        left: 200,
        marginLeft: -25,
        elevation: 5,
        zIndex: 10,
        marginBottom: '4%'
    },

    buttonAdd: {
        backgroundColor: '#1acf69ff',
        padding: 10,
        borderRadius: 50,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignContent: 'center',
        position: 'absolute',
        marginTop: '40%',
        left: 200,
        marginLeft: -25,
        elevation: 5,
        zIndex: 10,
    },

    pontoPositivo: {
        backgroundColor: '#0b9b4aff',
        padding: 10,
        borderBottomEndRadius: 20,
        borderRadius: 5,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignContent: 'center',
        position: 'absolute',
        top: 5,
        right: '0%',
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold'
    },

    pontoNetivo: {
        backgroundColor: '#9b0b0bff',
        padding: 10,
        borderRadius: 5,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignContent: 'center',
        position: 'absolute',
        top: 5,
        left: '0%',
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

})