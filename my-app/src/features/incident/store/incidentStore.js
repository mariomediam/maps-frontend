import { create } from "zustand";
import { getIncidents } from "@/features/incident/services/incidentApi";

const useIncidentsStore = create((set, get) => ({
  incidentsStored: [],
  isLoading: false,
  error: null,
  showMapFilters: false,
  showMapDetail: false,
  incidentSelected: null,

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

  toggleShowMapFilters: () => set({ showMapFilters: !get().showMapFilters }),
  toggleShowMapDetail: () => set({ showMapDetail: !get().showMapDetail }),

  setIncidentSelectedFromStore: (idIncident) => {
	console.log("idIncident, ", idIncident);
    if (idIncident) {
      const incident = get().incidentsStored.find(
        (incident) => incident.id_incident === idIncident
      );
      set({ incidentSelected: incident });
    } else {
      set({ incidentSelected: null });
    }
  },
}));

export default useIncidentsStore;
