import { useWords } from "@/context/WordsContext";
import i18n from "@/locates";
import { router } from "expo-router";
import { SquarePen, Trash2 } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import DeleteConfirmation from './../components/layout/DeleteConfirmation';

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
  };

  const handleEditClick = (categoria: string) => {
    setSelectedCategoria(categoria);
    setNewCategoriaName(categoria);
    setShowEditModal(true);
  };

  const onConfirmDelete = async () => {
    if (categoriaToDelete) {
      try {
        await handleDeleteCategoria(categoriaToDelete);
        await handleLoadCategorias();
      } catch (error) {
        console.error('Erro ao deletar categoria', error);
        Alert.alert('Erro', 'Não foi possível deletar a categoria');
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
        Alert.alert('Erro', 'Não foi possível editar a categoria');
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
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    });

    return (
      <TouchableOpacity
        style={styles.editar}
        onPress={() => handleEditClick(categoria)}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <SquarePen size={45} color="#000" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderLeftActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
    categoria: string
  ) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    });

    // Não permitir deletar "Sem Categoria"
    if (categoria === "Sem Categoria") {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.apagar}
        onPress={() => handleDeleteClick(categoria)}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Trash2 size={100} color="#FFF" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={i18n.t("listaDeCategorias.placeholderBusca")}
        placeholderTextColor="#888"
        style={styles.input}
        onChangeText={setSearch}
        value={search}
      />

      <Text style={styles.sectionTitle}>{i18n.t("listaDeCategorias.tituloSecao")}</Text>

      {filteredCategorias.map((cat) => (
        <Swipeable
          key={cat}
          ref={(ref) => { if (ref) swipeableRefs.current[cat] = ref; }}
          renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, cat)}
          renderLeftActions={(progress, dragX) => renderLeftActions(progress, dragX, cat)}
          onSwipeableWillOpen={() => closeOthers(cat)}
          rightThreshold={40}
          leftThreshold={40}
          friction={2}
        >
          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => router.push(`/listaDePalavras?categoria=${encodeURIComponent(cat)}`)}
          >
            <View style={styles.colorAccent} />
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{cat}</Text>
              <Text style={styles.categoryCount}>{wordCounts[cat] || 0}</Text>
            </View>
          </TouchableOpacity>
        </Swipeable>
      ))}

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
        animationType="slide"
        onRequestClose={onCancelEdit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {i18n.t('listaDeCategorias.editarCategoria')}
            </Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Nome da categoria"
              value={newCategoriaName}
              onChangeText={setNewCategoriaName}
              autoFocus
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
                style={[styles.modalButton, styles.confirmButton]}
                onPress={onConfirmEdit}
                disabled={!newCategoriaName.trim()}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f8f9fb",
    paddingVertical: 20,
    gap: 10,
  },
  input: {
    width: "92%",
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 12,
    fontSize: 17,
    fontWeight: "500",
    color: "#333",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    alignSelf: "flex-start",
    marginLeft: "5%",
    marginTop: 10,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    width: 380,
    height: 90,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    overflow: "hidden",
  },
  colorAccent: {
    width: 6,
    height: "100%",
    backgroundColor: "#4b7bec",
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  categoryCount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4b7bec",
    marginLeft: 20,
  },
  apagar: {
    backgroundColor: '#F81111',
    height: '100%',
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginRight: 10,
  },
  editar: {
    backgroundColor: '#FFD501',
    height: '100%',
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 10,
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
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  confirmButton: {
    backgroundColor: '#4b7bec',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});