import { create } from "zustand";

const useIncidentsStore = create((set, get) => ({
  selectedIncident: null,

  setSelectedIncident: (incident) => set({ selectedIncident: incident }),

}));

export default useIncidentsStore;
