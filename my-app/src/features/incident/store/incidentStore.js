import { create } from 'zustand'

const useIncidentsStore = create((set) => ({
  incidentsStored: [],
  setIncidentsStored: (incidents) => set({ incidentsStored: incidents }), 
}))

export default useIncidentsStore