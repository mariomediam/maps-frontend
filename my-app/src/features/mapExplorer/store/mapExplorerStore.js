import { create } from "zustand";

const useMapExplorerStore = create((set, get) => ({
    showFilters: false,
    expandMap: false,

    setShowFilters: (showFilters) => set({ showFilters: showFilters }),
    setExpandMap: (expandMap) => set({expandMap : expandMap})

}));

export default useMapExplorerStore;