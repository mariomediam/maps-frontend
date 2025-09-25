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
    console.log('🔍 [IncidentStore] Iniciando búsqueda de incidentes:', {
      filters,
      connectionType: navigator.connection?.effectiveType || 'unknown',
      timestamp: new Date().toISOString()
    });
    
    set({ isLoading: true, error: null, incidentsStored: [] });

    try {
      const startTime = Date.now();
      const incidents = await getIncidents(filters);
      const endTime = Date.now();
      
      console.log('✅ [IncidentStore] Incidentes obtenidos exitosamente:', {
        count: incidents?.length || 0,
        duration: `${endTime - startTime}ms`,
        filters,
        timestamp: new Date().toISOString()
      });
      
      set({
        incidentsStored: incidents,
        isLoading: false,
      });
      return incidents;
    } catch (error) {
      console.error('❌ [IncidentStore] Error buscando incidentes:', {
        error: error.message,
        stack: error.stack,
        filters,
        connectionType: navigator.connection?.effectiveType || 'unknown',
        timestamp: new Date().toISOString()
      });
      
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
    console.log('🎯 [IncidentStore] Seleccionando incidente:', {
      requestedId: idIncident,
      currentSelected: get().incidentSelected?.id_incident,
      totalIncidents: get().incidentsStored.length,
      timestamp: new Date().toISOString()
    });
    
    try {
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
          
          console.log('🔄 [IncidentStore] Actualizando estado del incidente seleccionado:', {
            incidentId: idIncident,
            summary: incident.summary,
            shouldResetExpanded,
            hasCoordinates: !!(incident.latitude && incident.longitude)
          });
          
          set({ 
            incidentSelected: incident,
            showMapDetail: true,
            showMapFilters: false, // En móvil se oculta, en desktop se mantiene visible el detalle
            isMapExpanded: shouldResetExpanded ? false : currentState.isMapExpanded
          });
          
          console.log("✅ [IncidentStore] Incidente seleccionado exitosamente:", {
            id: idIncident,
            summary: incident.summary
          });
          return true; // Indica que la selección fue exitosa
        } else {
          console.error("❌ [IncidentStore] Incidente no encontrado en el store:", {
            requestedId: idIncident,
            availableIds: get().incidentsStored.map(i => i.id_incident),
            totalIncidents: get().incidentsStored.length
          });
          return false; // Indica que la selección falló
        }
      } else {
        console.log('🗑️ [IncidentStore] Limpiando selección de incidente');
        set({ 
          incidentSelected: null,
          showMapDetail: false,
          isMapExpanded: false
        });
        return true;
      }
    } catch (error) {
      console.error('❌ [IncidentStore] Error crítico en setIncidentSelectedFromStore:', {
        error: error.message,
        stack: error.stack,
        requestedId: idIncident
      });
      return false;
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
    
    console.log('🎆 [IncidentStore] Creando nuevo incidente:', {
      incidentData: {
        category_id: incidentAdded.category_id,
        latitude: incidentAdded.latitude,
        longitude: incidentAdded.longitude,
        summary: incidentAdded.summary,
        reference: incidentAdded.reference,
        filesCount: incidentAdded.files?.length || 0
      },
      connectionType: navigator.connection?.effectiveType || 'unknown',
      timestamp: new Date().toISOString()
    });
    
    set({ isLoading: true, error: null });

    try {
      const startTime = Date.now();
      const newIncident = await createIncident(incidentAdded);
      const endTime = Date.now();
      
      console.log('✅ [IncidentStore] Incidente creado exitosamente:', {
        id: newIncident.id_incident,
        summary: newIncident.summary,
        duration: `${endTime - startTime}ms`,
        timestamp: new Date().toISOString()
      });
      
      set({
        isLoading: false,
        incidentAdded: INCIDENT_ADDED_DEFAULT, // Reset después de crear
        newlyCreatedIncidentId: newIncident.id_incident, // Guardar el ID del nuevo incidente
      });
      
      return newIncident;
    } catch (error) {
      console.error('❌ [IncidentStore] Error creando incidente:', {
        error: error.message,
        stack: error.stack,
        incidentData: incidentAdded,
        connectionType: navigator.connection?.effectiveType || 'unknown',
        timestamp: new Date().toISOString()
      });
      
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
