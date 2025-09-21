import { StyleSheet, Text, View } from "react-native";
import Swiper from "react-native-deck-swiper";
import { useWords } from "../../context/WordsContext";
import CardWords from "../components/CardWords";


export default function Inicio() {

    const { words, loading, handleToggleFavorite } = useWords();
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
                renderCard={( item ) => (
                    <CardWords
                        id={item.id}
                        favoritar={item.favoritar}
                        titulo={item.title}
                        traducao={item.traducao}
                        onToggleFavorite={handleToggleFavorite}
                    />
                )}
                cardIndex={0}
                backgroundColor="transparent"
                stackSize={3}
                stackSeparation={15}
                verticalSwipe={false}
            />

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: 'center',
        height: '90%'
    },

    wrapper:{
        flex: 1,
        padding: 20,
        marginVertical: 50
    }
})