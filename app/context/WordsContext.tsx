import { createContext, useContext, useEffect, useState } from "react";
import storage from "../services/storage";

interface WordsContextType {
    words: WordsItem[];
    loading: boolean;
    palavra: string;
    traducao: string;
    setPalavra: React.Dispatch<React.SetStateAction<string>>;
    setTraducao: React.Dispatch<React.SetStateAction<string>>;
    handleToggleFavorite: (id: number) => Promise<void>;
    handleAdd: () => Promise<boolean>;
    handleDelete: (id: number) => Promise<void>;
};

export interface WordsItem {
    id: number,
    title: string,
    traducao: string,
    favoritar: boolean
};

const WordsContext = createContext<WordsContextType | undefined>(undefined);

export const WordsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [words, setWords] = useState<WordsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [palavra, setPalavra] = useState("");
    const [traducao, setTraducao] = useState("");

    useEffect(() => {
        const fetchWords = async () => {
            const data = await storage.loadWordsData();
            setWords(data);
            setLoading(false)
        };

        fetchWords();
    }, []);

    const handleToggleFavorite = async (id: number) => {
        const updatedWords = words.map(word =>
            word.id === id ? { ...word, favoritar: !word.favoritar } : word
        );

        setWords(updatedWords);
        await storage.saveWordsData(updatedWords);
    };

    const handleAdd = async (): Promise<boolean> => {
        if (!palavra || !traducao) {
            alert('Necessario preencher todos os campos');
            return false;
        }

        try {
            const existeWords = await storage.loadWordsData();

            const nextId =
                existeWords.length > 0
                    ? Math.max(...existeWords.map((m: { id: any; }) => m.id)) + 1
                    : 1;

            const newWord = {
                id: nextId,
                title: palavra,
                traducao: traducao,
                favoritar: false
            };

            console.log('Palavra salva: ', newWord);

            const updatedWords = [...existeWords, newWord];

            await storage.saveWordsData(updatedWords);
            setWords(updatedWords);

            setPalavra("");
            setTraducao("");

            return true;

        } catch (error) {
            console.error('Erro ao adicionar palavra: ', error);
            return false;
        }

    };

    const handleDelete = async (id: number): Promise<void> => {
        try {
            const currentWords = await storage.loadWordsData();

            const updatedWords = currentWords.filter((word: WordsItem) => word.id !== id);

            await storage.saveWordsData(updatedWords);

            setWords(updatedWords)
        } catch (error) {
            console.error('Erro ao deletar palavra', error);

        }
    }

    return (
        <WordsContext.Provider value={{ words, loading, handleToggleFavorite, handleAdd, handleDelete, palavra, traducao, setPalavra, setTraducao }}>
            {children}
        </WordsContext.Provider>
    )
};

export const useWords = () => {
    const context = useContext(WordsContext);
    if (!context) {
        throw new Error("Erro ao usar o WordsContext")
    }

    return context;
}
