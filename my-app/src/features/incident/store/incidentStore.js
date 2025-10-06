import { create } from "zustand";
import {
  getIncidents,
  createIncident,
} from "@/features/incident/services/incidentApi";

const useIncidentsStore = create((set, get) => ({
  incidentsStored: [],
  isLoading: false,
  selectedIncident: null,
  error: null,

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
}));

export default useIncidentsStore;
