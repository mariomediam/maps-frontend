import { create } from 'zustand'
import { getIncidents } from '@/features/incident/services/incidentApi'

const useIncidentsStore = create((set, get) => ({
  incidentsStored: [],
  isLoading: false,
  error: null,
  
  setIncidentsStored: (incidents) => set({ incidentsStored: incidents }),
  
  searchIncidentsStored: async (filters = {}) => {
    set({ isLoading: true, error: null, incidentsStored: [] });
    
    try {
      const incidents = await getIncidents(filters);
      set({ 
        incidentsStored: incidents, 
        isLoading: false 
      });
      return incidents;
    } catch (error) {
      console.error('Error searching incidents:', error);
      set({ 
        error: error.message || 'Error al cargar incidentes', 
        isLoading: false 
      });
      throw error;
    }
  },
}))

export default useIncidentsStore