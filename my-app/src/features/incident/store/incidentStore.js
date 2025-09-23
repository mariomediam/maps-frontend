import { create } from "zustand";
import { getIncidents, createIncident } from "@/features/incident/services/incidentApi";

const INCIDENT_ADDED_DEFAULT = {
  category_id: 4,
  latitude: null,
  longitude: null,
  summary: null,
  reference: null,
  files: [],
};

const useIncidentsStore = create((set, get) => ({
  incidentsStored: [],
  isLoading: false,
  error: null,
  showMapFilters: false,
  showMapDetail: false,
  incidentSelected: null,
  isMapExpanded: false,
  incidentAdded: INCIDENT_ADDED_DEFAULT,
  newlyCreatedIncidentId: null, // ID del incidente recién creado
  
  
  setIncidentAdded: (params = {}) => set({ incidentAdded: { ...get().incidentAdded, ...params } }),
  resetIncidentAdded: () => set({ incidentAdded: INCIDENT_ADDED_DEFAULT }),

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
  toggleMapExpanded: () => set({ isMapExpanded: !get().isMapExpanded }),

  setIncidentSelectedFromStore: (idIncident) => {
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
        
        set({ 
          incidentSelected: incident,
          showMapDetail: true,
          showMapFilters: false, // En móvil se oculta, en desktop se mantiene visible el detalle
          isMapExpanded: shouldResetExpanded ? false : currentState.isMapExpanded
        });
        
        console.log("Incidente seleccionado desde store:", idIncident);
        return true; // Indica que la selección fue exitosa
      } else {
        console.warn("Incidente no encontrado en el store:", idIncident);
        return false; // Indica que la selección falló
      }
    } else {
      set({ 
        incidentSelected: null,
        showMapDetail: false,
        isMapExpanded: false
      });
      return true;
    }
  },

  // Función para cerrar el detalle del incidente
  closeIncidentDetail: () => {
    set({ 
      incidentSelected: null,
      showMapDetail: false,
      showMapFilters: true, // En desktop volver a mostrar filtros
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

  // Función para crear un nuevo incidente
  createIncidentFromStore: async () => {
    const { incidentAdded } = get();
    
    set({ isLoading: true, error: null });

    try {
      const newIncident = await createIncident(incidentAdded);
      
      set({
        isLoading: false,
        incidentAdded: INCIDENT_ADDED_DEFAULT, // Reset después de crear
        newlyCreatedIncidentId: newIncident.id_incident, // Guardar el ID del nuevo incidente
      });
      
      return newIncident;
    } catch (error) {
      console.error('Error creating incident:', error);
      set({
        error: error.message || "Error al crear el incidente",
        isLoading: false,
      });
      throw error;
    }
  },

  // Función para limpiar el ID del incidente recién creado
  clearNewlyCreatedIncident: () => set({ newlyCreatedIncidentId: null }),
}));

export default useIncidentsStore;
