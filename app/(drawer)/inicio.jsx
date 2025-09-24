import { RotateCw } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Swiper from "react-native-deck-swiper";
import { useWords } from "../../context/WordsContext";
import CardWords from "../components/CardWords";

export default function Inicio() {

    const { words, loading, handleToggleFavorite, handlePontuacao, handleResetPontuacao } = useWords();
    const filteredWords = words.filter((word) => !word.favoritar)

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
                <Text style={{ fontSize: 24, textAlign: 'center', width: 250 }}>
                    {words.length === 0
                        ? 'Você ainda não tem nenhum card'
                        : 'Todas as palavras foram favoritadas'
                    }
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>

            <Swiper
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
                <RotateCw size={30}/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: 'center',
        height: '90%'
    },

    wrapper: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center', 
        marginHorizontal: 10
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
        bottom: 20, 
        left: '50%', 
        marginLeft: -25, 
    }
})