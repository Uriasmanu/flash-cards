import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import { I18n } from "i18n-js";

const i18n = new I18n();

i18n.translations = {
  pt: {
    mensagemSistema: {
      carregando: "Carregando...",
    },
    index: {
      adicionarCard: "Adicione o seu primeiro card",
      finalLista: "Você chegou ao final da lista",
    },
    layout: {
      configuracao: "Configuração",
      indexTitulo: "Flash Cards",
      adicionarTitulo: "Nova Palavra",
      listaPalavrasTitulo: "Lista de Palavras",
      listaCategoriasTitulo: "Categorias",
      resumoTitulo: "Resumo",
    },
    adicionar: {
      alerta: "Por favor, preencha todos os campos obrigatórios.",
      tituloFrente1: "Frente do Card",
      tituloFrente2: "(Termo ou Pergunta)",
      requeride: "Obrigatório",
      exemploPalavra: "Ex: Qual é a capital da França?",
      tituloVerso1: "Verso do Card",
      tituloVerso2: "(Definição/Resposta)",
      exemploResposta: "Ex: Paris",
      botaoSalvar: "SALVAR FLASH CARD",
      categoria: "Categoria",
      modoSelecionar: "Selecionar",
      modoAdicionar: "Adicionar nova",
      placeholderNovaCategoria: "Nova categoria",
      botaoAddCategoria: "Adicionar",
      semCategoria: "Sem categoria",
    },
    listaDePalavras: {
      listaVazia: "Você ainda não tem palavras cadastradas",
      deleteConfirmacaoTitulo: "Você tem certeza?",
      deleteConfirmacaoTexto: "Tem certeza que quer apagar?",
      formTexto: "Editar Palavra",
    },
    listaDeCategorias: {
      placeholderBusca: "Buscar por Categoria",
      tituloSecao: "Categorias Salvas",
      deleteConfirmacaoTitulo: "Deletar Categoria",
      deleteConfirmacaoTexto:
        "Tem certeza que deseja deletar a categoria '{{categoria}}'? {{count}} palavra(s) serão movidas para 'Sem Categoria'.",
      editarCategoria: "Editar Categoria",
      cancelar: "Cancelar",
      salvar: "Salvar",
      categoriaVazia: "O nome da categoria não pode estar vazio",
      categoriaExistente: "Já existe uma categoria com este nome",
      naoDeletarSemCategoria:
        "Não é possível deletar a categoria 'Sem Categoria'",
      naoEditarSemCategoria:
        "Não é possível editar a categoria 'Sem Categoria'",
      categoriaDeletada: "Categoria deletada com sucesso",
      categoriaEditada: "Categoria editada com sucesso",
      erroDeletar: "Erro ao deletar categoria",
      erroEditar: "Erro ao editar categoria",
    },
    resumo: {
      titulo: "Seu Resumo de Vocabulário",
      semErrosTitulo: "Nenhum erro registrado ainda! 🎉",
      semErrosSubtitulo: "Continue praticando para ver seu progresso aqui.",
      palavrasComErro: "Palavras com erro",
      totalErros: "Total de erros",
      frequenciaErros: "Frequência de Erros",
    },
    configuracao: {
      cabecalho: "Lembretes de Estudo",
      lembrete: "Lembretes diários",
      lembreteTexto: "Receba um lembrete para estudar todos os dias",
      horarioLembrete: "Horário do lembrete",
      politica: "Política de Privacidade",
      atualizacao: "Atualizações",
      escolhaHorario: "Escolha o horário",
      cancelar: "Cancelar",
      confirmar: "Confirmar",
      infoVersaoTitulo: "Informações da Versão",
      versao: "Versão:",
      ultimaAtualizacao: "Última atualização:",
      novidades: "Novidades:",
      alertaPermissaoTitle: "Permissão Necessária",
      alertaPermissaoTexto:
        "Para ativar as notificações, é necessário conceder permissão.",
      alertaSucessoTitle: "Sucesso",
      alertaSucessoTextoAtivado: "Lembretes ativados!",
      alertaSucessoTextoDesativado: "Lembretes desativados!",
      alertaErro: "Não foi possível alterar as configurações de notificação.",
      erroAbrirLink: "Não foi possível abrir o link",
      erroPolitica: "Ocorreu um erro ao tentar abrir a política de privacidade",
      horarioDefinido: "Não foi possível atualizar o horário do lembrete.",
      idiomaAlteradoTitle: "Idioma alterado",
      idiomaAlteradoTexto: "O idioma foi alterado para {{lang}}",
    },
  },
  en: {
    mensagemSistema: {
      carregando: "Loading...",
    },
    index: {
      adicionarCard: "Add your first card",
      finalLista: "You've reached the end of the list",
    },
    layout: {
      configuracao: "Settings",
      indexTitulo: "Flash Cards",
      adicionarTitulo: "New Word",
      listaPalavrasTitulo: "Word List",
      listaCategoriasTitulo: "Categories",
      resumoTitulo: "Resumo",
    },
    adicionar: {
      alerta: "Please fill in all required fields.",
      tituloFrente1: "Card Front",
      tituloFrente2: "(Term or Question)",
      requeride: "Required",
      exemploPalavra: "E.g.: What is the capital of France?",
      tituloVerso1: "Card Back",
      tituloVerso2: "(Definition/Answer)",
      exemploResposta: "E.g.: Paris",
      botaoSalvar: "SAVE FLASH CARD",
      categoria: "Category",
      modoSelecionar: "Select",
      modoAdicionar: "Add new",
      placeholderNovaCategoria: "New category",
      botaoAddCategoria: "Add",
      semCategoria: "No category",
    },
    listaDePalavras: {
      listaVazia: "You don't have any words yet",
      deleteConfirmacaoTitulo: "Are you sure?",
      deleteConfirmacaoTexto: "Do you really want to delete?",
      formTexto: "Edit Word",
    },
    listaDeCategorias: {
      placeholderBusca: "Search by Category",
      tituloSecao: "Saved Categories",
      deleteConfirmacaoTitulo: "Delete Category",
      deleteConfirmacaoTexto:
        "Are you sure you want to delete the category '{{categoria}}'? {{count}} word(s) will be moved to 'No Category'.",
      editarCategoria: "Edit Category",
      cancelar: "Cancel",
      salvar: "Save",
      categoriaVazia: "Category name cannot be empty",
      categoriaExistente: "A category with this name already exists",
      naoDeletarSemCategoria: "Cannot delete the 'No Category' category",
      naoEditarSemCategoria: "Cannot edit the 'No Category' category",
      categoriaDeletada: "Category deleted successfully",
      categoriaEditada: "Category edited successfully",
      erroDeletar: "Error deleting category",
      erroEditar: "Error editing category",
    },
    resumo: {
      titulo: "Your Vocabulary Summary",
      semErrosTitulo: "No errors recorded yet! 🎉",
      semErrosSubtitulo: "Keep practicing to see your progress here.",
      palavrasComErro: "Words with errors",
      totalErros: "Total errors",
      frequenciaErros: "Error Frequency",
    },
    configuracao: {
      cabecalho: "Study Reminders",
      lembrete: "Daily reminders",
      lembreteTexto: "Get a reminder to study every day",
      horarioLembrete: "Reminder time",
      politica: "Privacy Policy",
      atualizacao: "Updates",
      escolhaHorario: "Choose the time",
      cancelar: "Cancel",
      confirmar: "Confirm",
      infoVersaoTitulo: "Version Information",
      versao: "Version:",
      ultimaAtualizacao: "Last update:",
      novidades: "What's new:",
      alertaPermissaoTitle: "Permission Required",
      alertaPermissaoTexto:
        "To enable notifications, you need to grant permission.",
      alertaSucessoTitle: "Success",
      alertaSucessoTextoAtivado: "Reminders enabled!",
      alertaSucessoTextoDesativado: "Reminders disabled!",
      alertaErro: "Could not change notification settings.",
      erroAbrirLink: "Could not open the link",
      erroPolitica: "An error occurred while trying to open the privacy policy",
      horarioDefinido: "Could not update reminder time.",
      idiomaAlteradoTitle: "Language changed",
      idiomaAlteradoTexto: "The language has been changed to {{lang}}",
    },
  },
};

// Configuração inicial
i18n.fallbacks = true;
i18n.defaultLocale = "pt";

// Função para inicializar o idioma
export const initI18n = async () => {
  try {
    const storedLang = await AsyncStorage.getItem("appLanguage");
    if (storedLang) {
      i18n.locale = storedLang;
    } else {
      const systemLocale = Localization.locale || "pt";
      i18n.locale = systemLocale.startsWith("pt") ? "pt" : "en";
    }
  } catch (error) {
    console.warn("Erro ao carregar idioma:", error);
    i18n.locale = "pt";
  }
};

// Função para mudar o idioma
export const changeLanguage = async (newLang) => {
  try {
    await AsyncStorage.setItem("appLanguage", newLang);
    i18n.locale = newLang;
    return true;
  } catch (error) {
    console.warn("Erro ao salvar idioma:", error);
    return false;
  }
};

// Inicializa imediatamente
initI18n();

export default i18n;
