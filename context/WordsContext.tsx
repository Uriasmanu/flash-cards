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
    handleLoadCategorias: () => Promise<void>;
    countWordsByCategory: () => Record<string, number>;
    handleDelete: (id: number) => Promise<void>;
    handleUpdate: (id: number, title: string, traducao: string, categoriaSelecionada: string) => Promise<boolean>;
    handlePontuacao: (id: number, delta: number) => Promise<void>;
    handleResetPontuacao: () => Promise<void>;
    getWordsWithErrors: () => WordsItem[];
    countPontuacaoPositive: () => number;
    countPontuacaoNegative: () => number;
    handleDeleteCategoria: (categoria: string) => Promise<void>;
    handleUpdateCategoria: (categoriaAntiga: string, categoriaNova: string) => Promise<boolean>;
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

            const corrigidas = data.map((word: WordsItem) => ({
                ...word,
                categorias: word.categoria && word.categoria.trim() !== "" ? word.categoria : "Sem Categoria"
            }));

            setWords(corrigidas);
            await storage.saveWordsData(corrigidas);

            const categoriasSalvas = await storage.loadCategoriasData();
            setCategorias(categoriasSalvas);

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

            let existeWords = await storage.loadWordsData();

            if (!Array.isArray(existeWords)) {
                existeWords = [];
            }

            // ✅ Verifica se a palavra já existe
            const palavraExiste = existeWords.some(
                (w: WordsItem) => w.title.toLowerCase() === palavra.toLowerCase()
            );

            if (palavraExiste) {
                alert('Esta palavra ou tradução já existe na lista!');
                return false;
            }


            const nextId = existeWords.length > 0 ? Math.max(...existeWords.map((m: { id: any; }) => m.id)) + 1 : 1;

            const newWord = {
                id: nextId,
                title: palavra,
                traducao: traducao,
                favoritar: false,
                pontuacao: 0,
                categoria: categoriaSelecionada || "Sem Categoria",
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

        const storedCategorias = await storage.loadCategoriasData();

        if (!storedCategorias.includes(novaCategoria)) {
            const updateCategorias = [...storedCategorias, novaCategoria];

            setCategorias(updateCategorias);
            await storage.saveCategoriasData(updateCategorias);

            await handleLoadCategorias();
        }
    };

    const handleLoadCategorias = async () => {
        try {
            const categoriasSalvas = await storage.loadCategoriasData();
            if (categoriasSalvas) {
                setCategorias(categoriasSalvas);
            } else {
                setCategorias([])
            }

        } catch (error) {
            console.error('Erro ao carregar categorias', error)
        }
    }

    const countWordsByCategory = (): Record<string, number> => {
        const counts: Record<string, number> = {};

        words.forEach(word => {
            const categoria = word.categoria || "Sem Categoria";
            counts[categoria] = (counts[categoria] || 0) + 1;
        });

        return counts;
    }

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
            const updatedWords = words.map((word) => {
                if (word.id === id) {
                    const novaPontuacao = word.pontuacao + delta;
                    let novaPontuacaoErro = word.pontuacaoErro || 0;

                    if (delta < 0) {
                        // Erro: aumenta contador de erros
                        novaPontuacaoErro += 1;
                    } else if (delta > 0 && novaPontuacaoErro > 0) {
                        // Acerto: diminui contador de erros (mas não fica negativo)
                        novaPontuacaoErro = Math.max(0, novaPontuacaoErro - 1);
                    }

                    return {
                        ...word,
                        pontuacao: novaPontuacao,
                        pontuacaoErro: novaPontuacaoErro
                    };
                }
                return word;
            });

            setWords(updatedWords);
            await storage.saveWordsData(updatedWords);
        } catch (error) {
            console.error('Erro ao atualizar pontuação', error);
        }
    };


    const getWordsWithErrors = (): WordsItem[] => {
        return words
            .filter(word => (word.pontuacaoErro || 0) > 0)
            .sort((a, b) => (b.pontuacaoErro || 0) - (a.pontuacaoErro || 0)); // do maior para o menor
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

    // NOVAS FUNÇÕES PARA GERENCIAR CATEGORIAS

    const handleDeleteCategoria = async (categoria: string): Promise<void> => {
        try {
            // Não permitir deletar "Sem Categoria"
            if (categoria === "Sem Categoria") {
                alert('Não é possível deletar a categoria "Sem Categoria"');
                return;
            }

            // Filtrar a categoria da lista de categorias
            const updatedCategorias = categorias.filter(cat => cat !== categoria);
            setCategorias(updatedCategorias);
            await storage.saveCategoriasData(updatedCategorias);

            // Atualizar palavras que usavam essa categoria para "Sem Categoria"
            const updatedWords = words.map(word =>
                word.categoria === categoria
                    ? { ...word, categoria: "Sem Categoria" }
                    : word
            );
            setWords(updatedWords);
            await storage.saveWordsData(updatedWords);

            console.log(`Categoria "${categoria}" deletada com sucesso`);
        } catch (error) {
            console.error('Erro ao deletar categoria:', error);
            throw error;
        }
    };

    const handleUpdateCategoria = async (categoriaAntiga: string, categoriaNova: string): Promise<boolean> => {
        try {
            if (!categoriaNova.trim()) {
                alert('O nome da categoria não pode estar vazio');
                return false;
            }

            // Não permitir editar "Sem Categoria"
            if (categoriaAntiga === "Sem Categoria") {
                alert('Não é possível editar a categoria "Sem Categoria"');
                return false;
            }

            // Verificar se a nova categoria já existe
            if (categorias.includes(categoriaNova) && categoriaNova !== categoriaAntiga) {
                alert('Já existe uma categoria com este nome');
                return false;
            }

            // Atualizar a lista de categorias
            const updatedCategorias = categorias.map(cat =>
                cat === categoriaAntiga ? categoriaNova : cat
            );
            setCategorias(updatedCategorias);
            await storage.saveCategoriasData(updatedCategorias);

            // Atualizar palavras que usavam a categoria antiga
            const updatedWords = words.map(word =>
                word.categoria === categoriaAntiga
                    ? { ...word, categoria: categoriaNova }
                    : word
            );
            setWords(updatedWords);
            await storage.saveWordsData(updatedWords);

            console.log(`Categoria "${categoriaAntiga}" atualizada para "${categoriaNova}"`);
            return true;
        } catch (error) {
            console.error('Erro ao atualizar categoria:', error);
            return false;
        }
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
                getWordsWithErrors,
                countPontuacaoPositive,
                countPontuacaoNegative,
                handleLoadCategorias,
                countWordsByCategory,
                handleDeleteCategoria,
                handleUpdateCategoria
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