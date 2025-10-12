
import { WordsItem } from "@/types/wordsTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";


const STORAGE_KEY = 'words';

const STORAGE_KEY_CATEGORIAS = 'categorias';

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

async function updateWordsData(id: number, title: string, traducao: string, categoria: string): Promise<WordsItem[]> {
    try {
        const words = await loadWordsData();
        const updateWords = words.map((word: WordsItem) =>
            word.id === id
                ? { ...word, title: title, traducao: traducao, categoria: categoria }
                : word
        )

        await saveWordsData(updateWords);
        return (updateWords)
    } catch (error) {
        console.error('Erro ao deletar palavra', error)
        return []
    }
}

async function getWordsPontuacao(): Promise<{ positive: number[], negative: number[] }> {
    try {
        const words = await loadWordsData();
        const filteredPositive = words.filter((word: WordsItem) => word.pontuacao === 1);
        const filteredNegative = words.filter((word: WordsItem) => word.pontuacao === -1);

        const positive = filteredPositive.map((word: WordsItem) => word.id);
        const negative = filteredNegative.map((word: WordsItem) => word.id);

        return { positive, negative }
    } catch (error) {
        console.error('Erro ao retorna pontuação', error);
        return { positive: [], negative: [] };
    }
}

async function saveCategoriasData(data: string[]): Promise<void> {
    try {
        await AsyncStorage.setItem(STORAGE_KEY_CATEGORIAS, JSON.stringify(data));
    } catch (error) {
        console.error('Erro ao salvar categorias', error);
    }
}

async function loadCategoriasData(): Promise<string[]> {
    try {
        const value = await AsyncStorage.getItem(STORAGE_KEY_CATEGORIAS);
        return value ? JSON.parse(value) : [];
    } catch (error) {
        console.error('Erro ao carregar categorias', error);
        return [];
    }
}

export default { 
    saveWordsData, 
    loadWordsData, 
    deleteWordData, 
    updateWordsData, 
    getWordsPontuacao,
    saveCategoriasData,
    loadCategoriasData, 
};