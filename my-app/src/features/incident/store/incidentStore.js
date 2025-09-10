import { create } from "zustand";
import { getIncidents } from "@/features/incident/services/incidentApi";

const useIncidentsStore = create((set, get) => ({
  incidentsStored: [],
  isLoading: false,
  error: null,
  showMapFilters: false,
  showMapDetail: false,
  incidentSelected: null,
  isMapExpanded: false,

  setIncidentsStored: (incidents) => set({ incidentsStored: incidents }),

  searchIncidentsStored: async (filters = {}) => {
    set({ isLoading: true, error: null, incidentsStored: [] });

    try {
      const incidents = await getIncidents(filters);
      set({
        incidentsStored: incidents,
        isLoading: false,
      });
      return incidents;
    } catch (error) {
      // console.error('Error searching incidents:', error);
      set({
        error: error.message || "Error al cargar incidentes",
        isLoading: false,
      });
      throw error;
    }
  },

  setShowMapFilters: (showMapFilters) => set({ showMapFilters }),
  setShowMapDetail: (showMapDetail) => set({ showMapDetail }),
  setIsMapExpanded: (isMapExpanded) => set({ isMapExpanded }),

  toggleShowMapFilters: () => set({ showMapFilters: !get().showMapFilters }),
  toggleShowMapDetail: () => set({ showMapDetail: !get().showMapDetail }),
  toggleMapExpanded: () => {
    const currentExpanded = get().isMapExpanded;
    console.log('🔄 toggleMapExpanded:', currentExpanded, '->', !currentExpanded);
    set({ isMapExpanded: !currentExpanded });
  },

  setIncidentSelectedFromStore: (idIncident) => {
    console.log('🔥 setIncidentSelectedFromStore llamado con:', idIncident);
    console.trace('Stack trace para ver de dónde viene la llamada');
    
    if (idIncident) {
      const incident = get().incidentsStored.find(
        (incident) => incident.id_incident === idIncident
      );
      if (incident) {
        const currentState = get();
        const currentIncident = currentState.incidentSelected;
        
        // Si es el mismo incidente, no resetear isMapExpanded
        // Convertir ambos a string para comparación segura
        const currentId = currentIncident?.id_incident?.toString();
        const newId = idIncident?.toString();
        const shouldResetExpanded = !currentIncident || currentId !== newId;
        
        console.log('🔍 Debug comparación:', {
          currentIncidentId: currentIncident?.id_incident,
          newIncidentId: idIncident,
          sameIncident: currentIncident?.id_incident === idIncident,
          shouldResetExpanded
        });
        
        console.log('✅ Seleccionando incidente:', incident.id_incident, 'resetear expanded:', shouldResetExpanded);
        set({ 
          incidentSelected: incident,
          showMapDetail: true,
          showMapFilters: false,
          isMapExpanded: shouldResetExpanded ? false : currentState.isMapExpanded
        });
      }
    } else {
      console.log('🚫 Limpiando selección de incidente');
      set({ 
        incidentSelected: null,
        showMapDetail: false,
        isMapExpanded: false
      });
    }
  },

  // Función para cerrar el detalle del incidente
  closeIncidentDetail: () => {
    set({ 
      incidentSelected: null,
      showMapDetail: false,
      showMapFilters: true,
      isMapExpanded: false
    });
  },

  // Función para inicializar el estado al cargar la página
  initializeMapState: (isMobile) => {
    if (isMobile) {
      set({ 
        showMapFilters: false,
        showMapDetail: false,
        incidentSelected: null,
        isMapExpanded: false
      });
    } else {
      set({ 
        showMapFilters: true,
        showMapDetail: false,
        incidentSelected: null,
        isMapExpanded: false
      });
    }
  },
}));

export default useIncidentsStore;
