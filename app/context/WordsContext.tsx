import { createContext, useContext, useEffect, useState } from "react";
import storage from "../services/storage";

interface WordsContextType {
    words: WordsItem[];
    loading: boolean;
    handleToggleFavorite: (id: number) => Promise<void>;
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

    return (
        <WordsContext.Provider value={{ words, loading, handleToggleFavorite }}>
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
