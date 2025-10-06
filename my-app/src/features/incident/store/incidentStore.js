import { create } from "zustand";
import {
  getIncidents,
  createIncident,
} from "@/features/incident/services/incidentApi";

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
  selectedIncident: null,
  error: null,
  incidentAdded: INCIDENT_ADDED_DEFAULT,

  searchIncidentsStored: async (filters = {}) => {
    set({ isLoading: true, error: null, incidentsStored: [] });

    try {
      const incidents = await getIncidents(filters);
      set({
        incidentsStored: incidents,
        isLoading: false,
      });
      const incidentsWithFlag = incidents.map((incident) => ({
        ...incident,
        showOnMap: true,
      }));
      return incidentsWithFlag;
    } catch (error) {
      console.error("❌ [IncidentStore] Error buscando incidentes:", {
        error: error.message,
        stack: error.stack,
        filters,
        connectionType: navigator.connection?.effectiveType || "unknown",
        timestamp: new Date().toISOString(),
      });

      set({
        error: error.message || "Error al cargar incidentes",
        isLoading: false,
      });
      throw error;
    }
  },

  setSelectedIncident: (incident) => set({ selectedIncident: incident }),

   // Seleccionar incidente por ID
   setSelectedIncidentById: (incidentId) => {
    const { incidentsStored } = get();
    const incident = incidentsStored.find(
      (inc) => inc.id_incident === parseInt(incidentId)
    );
    
    if (incident) {
      console.log('🎯 [IncidentStore] Seleccionando incidente por ID:', {
        id_incident: incident.id_incident,
        summary: incident.summary
      });
      set({ selectedIncident: incident });
    } else {
      console.warn('⚠️ [IncidentStore] Incidente no encontrado con ID:', incidentId);
    }
  },

  setIncidentAdded: (params = {}) => set({ incidentAdded: { ...get().incidentAdded, ...params } }),
  
  resetIncidentAdded: () => set({ incidentAdded: INCIDENT_ADDED_DEFAULT }),

  // Función para crear un nuevo incidente
  createIncidentFromStore: async () => {
    const { incidentAdded } = get();
    
    // console.log('🎆 [IncidentStore] Creando nuevo incidente:', {
    //   incidentData: {
    //     category_id: incidentAdded.category_id,
    //     latitude: incidentAdded.latitude,
    //     longitude: incidentAdded.longitude,
    //     summary: incidentAdded.summary,
    //     reference: incidentAdded.reference,
    //     filesCount: incidentAdded.files?.length || 0
    //   },
    //   connectionType: navigator.connection?.effectiveType || 'unknown',
    //   timestamp: new Date().toISOString()
    // });
    
    set({ isLoading: true, error: null });

    try {
      // const startTime = Date.now();
      const newIncident = await createIncident(incidentAdded);
      // const endTime = Date.now();
      
      // console.log('✅ [IncidentStore] Incidente creado exitosamente:', {
      //   id: newIncident.id_incident,
      //   summary: newIncident.summary,
      //   duration: `${endTime - startTime}ms`,
      //   timestamp: new Date().toISOString()
      // });
      
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



}));

export default useIncidentsStore;
