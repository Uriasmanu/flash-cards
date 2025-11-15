import { useWords } from "@/context/WordsContext";
import i18n from "@/locates";
import { router } from "expo-router";
import { Folder, Plus, Search, SquarePen, Trash2 } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { SafeAreaView } from 'react-native-safe-area-context';
import DeleteConfirmation from './../components/layout/DeleteConfirmation';

// --- Cores e Design System Consistente ---
const COLORS = {
    PRIMARY: '#2563EB',
    PRIMARY_DARK: '#1D4ED8',
    BACKGROUND: '#FFFFFF',
    BACKGROUND_GRAY: '#F8FAFC',
    CARD_BACKGROUND: '#FFFFFF',
    TEXT_PRIMARY: '#1E293B',
    TEXT_SECONDARY: '#64748B',
    TEXT_DISABLED: '#94A3B8',
    BORDER: '#E2E8F0',
    SUCCESS: '#10B981',
    WARNING: '#FFD501',
    ERROR: '#EF4444',
    SWIPE_DELETE: '#DC2626',
    SWIPE_EDIT: '#FFD501',
};

type SwipeableRefs = {
  [key: string]: Swipeable | null;
};

export default function ListaDeCategoriasScreen() {
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const [newCategoriaName, setNewCategoriaName] = useState("");
  const [categoriaToDelete, setCategoriaToDelete] = useState<string | null>(null);

  const {
    handleLoadCategorias,
    countWordsByCategory,
    categorias,
    handleDeleteCategoria,
    handleUpdateCategoria
  } = useWords();

  const swipeableRefs = useRef<SwipeableRefs>({});

  useEffect(() => {
    handleLoadCategorias();
  }, []);

  const wordCounts = countWordsByCategory();

  const allCategorias = Array.from(new Set([...categorias, ...Object.keys(wordCounts)]));
  const filteredCategorias = allCategorias.filter(cat =>
    cat.toLowerCase().includes(search.toLowerCase())
  );

  const closeOthers = (categoria: string) => {
    Object.keys(swipeableRefs.current).forEach((key) => {
      if (key !== categoria && swipeableRefs.current[key]) {
        swipeableRefs.current[key]?.close();
      }
    });
  };

  const handleDeleteClick = (categoria: string) => {
    setCategoriaToDelete(categoria);
    setShowDeleteModal(true);
    closeOthers(categoria);
  };

  const handleEditClick = (categoria: string) => {
    setSelectedCategoria(categoria);
    setNewCategoriaName(categoria);
    setShowEditModal(true);
    closeOthers(categoria);
  };

  const handleAddCategory = () => {
    // Navega para a tela de adicionar palavra com foco na criação de categoria
    router.push('/adicionar');
  };

  const onConfirmDelete = async () => {
    if (categoriaToDelete) {
      try {
        await handleDeleteCategoria(categoriaToDelete);
        await handleLoadCategorias();
      } catch (error) {
        console.error('Erro ao deletar categoria', error);
        Alert.alert(i18n.t('mensagemSistema.erro'), i18n.t('listaDeCategorias.erroDeletar'));
      } finally {
        setShowDeleteModal(false);
        setCategoriaToDelete(null);
      }
    }
  };

  const onCancelDelete = () => {
    setShowDeleteModal(false);
    setCategoriaToDelete(null);
  };

  const onConfirmEdit = async () => {
    if (selectedCategoria && newCategoriaName.trim()) {
      try {
        const success = await handleUpdateCategoria(selectedCategoria, newCategoriaName.trim());
        if (success) {
          await handleLoadCategorias();
          setShowEditModal(false);
          setSelectedCategoria(null);
          setNewCategoriaName("");
        }
      } catch (error) {
        console.error('Erro ao editar categoria', error);
        Alert.alert(i18n.t('mensagemSistema.erro'), i18n.t('listaDeCategorias.erroEditar'));
      }
    }
  };

  const onCancelEdit = () => {
    setShowEditModal(false);
    setSelectedCategoria(null);
    setNewCategoriaName("");
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
    categoria: string
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, -40, 0],
      outputRange: [1, 0.8, 0],
      extrapolate: 'clamp'
    });

    const opacity = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    // Não permitir editar "Sem Categoria"
    if (categoria === i18n.t('categorias.semCategoria')) {
      return null;
    }

    return (
      <Animated.View style={[styles.actionWrapperRight, { opacity }]}>
        <TouchableOpacity
          style={styles.editar}
          onPress={() => handleEditClick(categoria)}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <SquarePen size={30} color="#FFF" />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderLeftActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
    categoria: string
  ) => {
    const scale = dragX.interpolate({
      inputRange: [0, 40, 80],
      outputRange: [0, 0.8, 1],
      extrapolate: 'clamp'
    });

    const opacity = dragX.interpolate({
      inputRange: [0, 80],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    // Não permitir deletar "Sem Categoria"
    if (categoria === i18n.t('categorias.semCategoria')) {
      return null;
    }

    return (
      <Animated.View style={[styles.actionWrapperLeft, { opacity }]}>
        <TouchableOpacity
          style={styles.apagar}
          onPress={() => handleDeleteClick(categoria)}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <Trash2 size={30} color="#FFF" />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderCategoryItem = ({ item: cat }: { item: string }) => (
    <Swipeable
      key={cat}
      ref={(ref) => { if (ref) swipeableRefs.current[cat] = ref; }}
      renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, cat)}
      renderLeftActions={(progress, dragX) => renderLeftActions(progress, dragX, cat)}
      onSwipeableWillOpen={() => closeOthers(cat)}
      rightThreshold={80}
      leftThreshold={80}
      friction={2}
      containerStyle={styles.swipeableContainer}
    >
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() => router.push(`/listaDePalavras?categoria=${encodeURIComponent(cat)}`)}
      >
        <View style={styles.categoryIcon}>
          <Folder size={24} color={COLORS.PRIMARY} />
        </View>
        <View style={styles.categoryInfo}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryName} numberOfLines={1}>{cat}</Text>
            <View style={[
              styles.countBadge,
              cat === i18n.t('categorias.semCategoria') && styles.countBadgeDefault
            ]}>
              <Text style={styles.categoryCount}>
                {i18n.t('listaDeCategorias.totalCards', { count: wordCounts[cat] || 0 })}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BACKGROUND_GRAY} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {i18n.t('layout.listaCategoriasTitulo')}
          </Text>
          <Text style={styles.headerSubtitle}>
            {filteredCategorias.length} {i18n.t('listaDeCategorias.totalCategorias', { count: filteredCategorias.length })}
          </Text>
        </View>

        {/* Search Bar com Botão Adicionar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={COLORS.TEXT_SECONDARY} />
            <TextInput
              placeholder={i18n.t("listaDeCategorias.placeholderBusca")}
              placeholderTextColor={COLORS.TEXT_DISABLED}
              style={styles.searchInput}
              onChangeText={setSearch}
              value={search}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Text style={styles.clearText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddCategory}
          >
            <Plus color={COLORS.BACKGROUND} size={20} />
          </TouchableOpacity>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {i18n.t("listaDeCategorias.tituloSecao")}
          </Text>
          <View style={styles.sectionIndicator} />
        </View>

        {/* Categories List */}
        <FlatList
          data={filteredCategorias}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>
                {search ? i18n.t('listaDeCategorias.semResultados') : i18n.t('listaDeCategorias.nenhumaCategoria')}
              </Text>
              <Text style={styles.emptyStateText}>
                {search 
                  ? i18n.t('listaDeCategorias.tenteOutroTermo')
                  : i18n.t('listaDeCategorias.adicionarPrimeiraCategoria')
                }
              </Text>
              {!search && (
                <TouchableOpacity
                  style={styles.emptyStateButton}
                  onPress={handleAddCategory}
                >
                  <Plus color={COLORS.BACKGROUND} size={20} />
                  <Text style={styles.emptyStateButtonText}>
                    {i18n.t('categorias.adicionarCategoria')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />

        {/* Modal de Confirmação de Delete */}
        {showDeleteModal && (
          <View style={styles.overlay}>
            <DeleteConfirmation
              title={i18n.t('listaDeCategorias.deleteConfirmacaoTitulo')}
              mensagem={i18n.t('listaDeCategorias.deleteConfirmacaoTexto', { 
                categoria: categoriaToDelete,
                count: wordCounts[categoriaToDelete!] || 0 
              })}
              onCancel={onCancelDelete}
              onConfirm={onConfirmDelete}
            />
          </View>
        )}

        {/* Modal de Edição */}
        <Modal
          visible={showEditModal}
          transparent={true}
          animationType="fade"
          onRequestClose={onCancelEdit}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {i18n.t('listaDeCategorias.editarCategoria')}
                </Text>
                <TouchableOpacity onPress={onCancelEdit} style={styles.modalCloseButton}>
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <TextInput
                style={styles.modalInput}
                placeholder={i18n.t('listaDeCategorias.editarCategoriaPlaceholder')}
                placeholderTextColor={COLORS.TEXT_DISABLED}
                value={newCategoriaName}
                onChangeText={setNewCategoriaName}
                autoFocus
                selectionColor={COLORS.PRIMARY}
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={onCancelEdit}
                >
                  <Text style={styles.cancelButtonText}>
                    {i18n.t('listaDeCategorias.cancelar')}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.modalButton, 
                    styles.confirmButton,
                    (!newCategoriaName.trim() || newCategoriaName === selectedCategoria) && styles.confirmButtonDisabled
                  ]}
                  onPress={onConfirmEdit}
                  disabled={!newCategoriaName.trim() || newCategoriaName === selectedCategoria}
                >
                  <Text style={styles.confirmButtonText}>
                    {i18n.t('listaDeCategorias.salvar')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_GRAY,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  clearText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    padding: 4,
  },
  addButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  sectionIndicator: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 2,
  },
  listContent: {
    paddingBottom: 20,
  },
  swipeableContainer: {
    borderRadius: 12,
    marginVertical: 4,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.PRIMARY + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
    marginRight: 12,
  },
  countBadge: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  countBadgeDefault: {
    backgroundColor: COLORS.TEXT_SECONDARY,
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.BACKGROUND,
  },
  categorySubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  itemSeparator: {
    height: 12,
  },
  actionWrapperRight: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  actionWrapperLeft: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  apagar: {
    backgroundColor: COLORS.SWIPE_DELETE,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  editar: {
    backgroundColor: COLORS.SWIPE_EDIT,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 16,
    padding: 0,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalCloseText: {
    fontSize: 20,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '300',
  },
  modalInput: {
    margin: 20,
    marginTop: 0,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  modalButtons: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.BACKGROUND_GRAY,
  },
  confirmButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  confirmButtonDisabled: {
    backgroundColor: COLORS.TEXT_DISABLED,
  },
  cancelButtonText: {
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
    fontSize: 16,
  },
  confirmButtonText: {
    color: COLORS.BACKGROUND,
    fontWeight: '600',
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyStateButtonText: {
    color: COLORS.BACKGROUND,
    fontSize: 16,
    fontWeight: '600',
  },
});