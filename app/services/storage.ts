
import AsyncStorage from "@react-native-async-storage/async-storage";
import WordsItem from "../types/wordsTypes";

const STORAGE_KEY = 'words'

async function saveWordsData(data: WordsItem[]): Promise<void> {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Erro ao salvar palavra', error)
    }
}

async function loadWordsData() {
    try {
        const value = await AsyncStorage.getItem('words');
        return value ? JSON.parse(value) : [];

    } catch (error) {
        console.error('Erro ao buscar palavra', error)
    }
}

async function deleteWordData(id: number): Promise<void> {
    try {
        const words = await loadWordsData();
        const filtereWords = words.filter((words: WordsItem) => words.id !== id);
        await saveWordsData(filtereWords);

    } catch (error) {
        console.error('Erro ao deletar palavra', error)
    }
}

async function updateWordsData(id: number, title: string, traducao: string): Promise<WordsItem[]> {
    try {
        const words = await loadWordsData();
        const updateWords = words.map((word: WordsItem) => 
            word.id === id
            ? {...word, title: title, traducao: traducao}
            : word
        )

        await saveWordsData(updateWords);
        return(updateWords)
    } catch (error) {
        console.error('Erro ao deletar palavra', error)
        return []
    }
}

export default { saveWordsData, loadWordsData, deleteWordData, updateWordsData };