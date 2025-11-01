export interface WordsItem {
    id: number,
    title: string,
    traducao: string,
    favoritar: boolean,
    pontuacao: number,
    categoria: string,
    pontuacaoErro?: number;
}