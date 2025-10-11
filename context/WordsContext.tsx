import storage from "@/services/storage";
import { WordsItem } from "@/types/wordsTypes";
import { createContext, useContext, useEffect, useState } from "react";

interface WordsContextType {
    words: WordsItem[];
    loading: boolean;
    palavra: string;
    traducao: string;
    categorias: string[];
    setPalavra: React.Dispatch<React.SetStateAction<string>>;
    setTraducao: React.Dispatch<React.SetStateAction<string>>;
    handleToggleFavorite: (id: number) => Promise<void>;
    handleAdd: (categoriaSelecionada: string) => Promise<boolean>;
    handleAddCategoria: (novaCategoria: string) => void;
    handleDelete: (id: number) => Promise<void>;
    handleUpdate: (id: number, title: string, traducao: string, categoriaSelecionada: string) => Promise<boolean>;
    handlePontuacao: (id: number, delta: number) => Promise<void>;
    handleResetPontuacao: () => Promise<void>;
    countPontuacaoPositive: () => number;
    countPontuacaoNegative: () => number;
}

const WordsContext = createContext<WordsContextType | undefined>(undefined);

export const WordsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [words, setWords] = useState<WordsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [palavra, setPalavra] = useState("");
    const [traducao, setTraducao] = useState("");
    const [categorias, setCategorias] = useState<string[]>([]);

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

    const handleAdd = async (categoriaSelecionada: string): Promise<boolean> => {
        if (!palavra || !traducao) {
            alert('Necessario preencher todos os campos');
            return false;
        }

        try {
            const existeWords = await storage.loadWordsData();
            const nextId = existeWords.length > 0 ? Math.max(...existeWords.map((m: { id: any; }) => m.id)) + 1 : 1;

            const newWord = {
                id: nextId,
                title: palavra,
                traducao: traducao,
                favoritar: false,
                pontuacao: 0,
                categoria: categoriaSelecionada || "Sem Categoria",
                listaCategorias: categorias
            };

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


    const handleAddCategoria = async (novaCategoria: string) => {
        if (!novaCategoria) return;
        if (!categorias.includes(novaCategoria)) {
            const updatedCategorias = [...categorias, novaCategoria];
            setCategorias(updatedCategorias);

            // Salva a lista de categorias atualizada no storage
            const storedWords = await storage.loadWordsData();
            const updatedWords = storedWords.map((word: any) => ({
                ...word,
                listaCategorias: updatedCategorias
            }));
            await storage.saveWordsData(updatedWords);
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
    };

    const handleUpdate = async (
        id: number,
        title: string,
        traducao: string,
        categoriaSelecionada: string
    ): Promise<boolean> => {
        try {
            const updateWords = words.map(word =>
                word.id === id ? { ...word, title, traducao, categoria: categoriaSelecionada } : word
            );

            await storage.saveWordsData(updateWords);
            setWords(updateWords);

            setPalavra("");
            setTraducao("");

            return true;
        } catch (error) {
            console.error('Erro ao atualizar palavra', error);
            return false;
        }
    };


    const handlePontuacao = async (id: number, delta: number) => {
        try {
            const updatedWords = words.map((word) =>
                word.id === id ? { ...word, pontuacao: word.pontuacao + delta } : word
            );

            setWords(updatedWords);
            await storage.saveWordsData(updatedWords);
        } catch (error) {
            console.error('Erro ao atualiza pontuação', error)
        }
    };

    const handleResetPontuacao = async (): Promise<void> => {
        try {
            const updatedWords = words.map((word) => ({
                ...word,
                pontuacao: 0,
                categorias: ['']
            }));

            const shuffledWords = updatedWords.sort(() => Math.random() - 0.5)

            setWords(shuffledWords);
            await storage.saveWordsData(shuffledWords);
        } catch (error) {
            console.error('Erro ao restaurar pontuação', error)
        }

    };

    const countPontuacaoPositive = () => {
        return words.filter((word) => word.pontuacao === 1).length;
    };

    const countPontuacaoNegative = () => {
        return words.filter((word) => word.pontuacao === -1).length;
    };

    return (
        <WordsContext.Provider
            value={{
                words,
                loading,
                categorias,
                palavra,
                traducao,
                setPalavra,
                setTraducao,
                handleToggleFavorite,
                handleAdd,
                handleAddCategoria,
                handleDelete,
                handleUpdate,
                handlePontuacao,
                handleResetPontuacao,
                countPontuacaoPositive,
                countPontuacaoNegative,
            }}
        >
            {children}
        </WordsContext.Provider>
    );
};

export const useWords = () => {
    const context = useContext(WordsContext);
    if (!context) throw new Error("Erro ao usar o WordsContext");
    return context;
};
