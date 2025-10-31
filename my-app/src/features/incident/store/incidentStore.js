import { create } from "zustand";
import {
  getIncidents,
  createIncident,
  updatePartialIncident,
  updateIncident,
  deleteIncident,
} from "@/features/incident/services/incidentApi";

const INCIDENT_ADDED_DEFAULT = {
  category_id: null,
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

  // Función para actualizar un incidente
  updatePartialIncidentFromStore: async (idIncident, incidentData) => {
    // const { incidentAdded } = get();
    set({ isLoading: true, error: null });
    try {
      const updatedIncident = await updatePartialIncident(idIncident, incidentData);
      // Actualizar el incidente en el store
      set((state) => ({
        incidentsStored: state.incidentsStored.map((incident) =>
          incident.id_incident === idIncident ? { ...incident, ...updatedIncident } : incident
        ),
        isLoading: false,
      }));
      
      return updatedIncident;
    } catch (error) {
      console.error('❌ [IncidentStore] Error actualizando incidente:', {
        error: error.message,
        stack: error.stack,
        incidentData: incidentData,
      });
      set({
        error: error.message || "Error al actualizar el incidente",
        isLoading: false,
      });
      throw error;
    }
  },


  // Función para actualizar un  incidente
  updateIncidentFromStore: async () => {
    const { incidentAdded } = get();   
    
    set({ isLoading: true, error: null });

    try {      
      const newIncident = await updateIncident(incidentAdded);      
      
      set({
        isLoading: false,
        incidentAdded: INCIDENT_ADDED_DEFAULT, // Reset después de crear
        newlyCreatedIncidentId: newIncident.id_incident, // Guardar el ID del nuevo incidente
      });
      
      return newIncident;
    } catch (error) {
      console.error('❌ [IncidentStore] Erro actualizando incidente:', {
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


  deleteIncidentFromStore: async (idIncident) => {
    
    set({ isLoading: true, error: null });

    try {      
      await deleteIncident(idIncident);    
      
      // eliminar el incidente en el store
      set((state) => ({
        incidentsStored: state.incidentsStored.filter((incident) => incident.id_incident !== idIncident),
        isLoading: false,
      }));
   
      
      
    } catch (error) {
      console.error('❌ [IncidentStore] Erro eliminando el incidente:', {
        error: error.message,
        stack: error.stack,
        incidentData: { id_incident: idIncident },
        connectionType: navigator.connection?.effectiveType || 'unknown',
        timestamp: new Date().toISOString()
      });
      
      set({
        error: error.message || "Error al eliminar el incidente",
        isLoading: false,
      });
      throw error;
    }
  },


}));

export default useIncidentsStore;
