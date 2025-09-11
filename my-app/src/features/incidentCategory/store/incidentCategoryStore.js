import { create } from "zustand";
import { getIncidentCategories } from "../services/incidentCategoryApi";

const useIncidentCategoryStore = create((set, get) => ({
  incidentCategories: [],
  isLoading: false,
  isLoaded: false,
  error: null,

  // Función para cargar las categorías solo si no están cargadas
  loadIncidentCategories: async () => {
    const currentState = get();
    
    // Si ya están cargadas o se están cargando, no hacer nada
    if (currentState.isLoaded || currentState.isLoading) {
      return currentState.incidentCategories;
    }

    set({ isLoading: true, error: null });

    try {
      const categories = await getIncidentCategories();
      categories.unshift({ id_category: 0, description: 'Todos' });
      
      set({
        incidentCategories: categories,
        isLoading: false,
        isLoaded: true,
      });
      
      return categories;
    } catch (error) {
      set({
        error: error.message || "Error al cargar categorías",
        isLoading: false,
      });
      throw error;
    }
  },
}));

export default useIncidentCategoryStore;


