
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = 'words'

export interface WordsItem {
    id: number,
    title: string,
    traducao: string,
    favoritar: boolean
}

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

export default { saveWordsData, loadWordsData };