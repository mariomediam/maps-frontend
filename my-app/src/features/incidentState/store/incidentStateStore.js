import { create } from "zustand";
import { getIncidentStates } from "../services/incidentStateApi";

const useIncidentStateStore = create((set, get) => ({
  incidentStates: [],
  isLoading: false,
  isLoaded: false,
  error: null,

  // Función para cargar los estados solo si no están cargados
  loadIncidentStates: async () => {
    const currentState = get();
    
    // Si ya están cargados o se están cargando, no hacer nada
    if (currentState.isLoaded || currentState.isLoading) {
      return currentState.incidentStates;
    }

    set({ isLoading: true, error: null });

    try {
      const states = await getIncidentStates();
      states.unshift({ id_state: 0, description: 'Todos' });
      
      set({
        incidentStates: states,
        isLoading: false,
        isLoaded: true,
      });
      
      return states;
    } catch (error) {
      set({
        error: error.message || "Error al cargar estados",
        isLoading: false,
      });
      throw error;
    }
  },
}));

export default useIncidentStateStore;


