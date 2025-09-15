import { useEffect, useState } from "react";
import storage from "../services/storage";

interface HookProp {
    id: number,
    favoritar: boolean
};

export interface WordsItem {
    id: number,
    title: string,
    traducao: string,
    favoritar: boolean
};

export default function useWords() {
    const [words, setWords] = useState<HookProp[]>([]);
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
        await storage.saveWordsData(updatedWords as WordsItem[]);
    };

    return { words, setWords, loading, setLoading, handleToggleFavorite };
}