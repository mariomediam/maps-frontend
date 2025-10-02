import { create } from "zustand";

const useMapExplorerStore = create((set, get) => ({
    showSideBar: false,
    expandMap: false,
    addingIncident: false,

    setShowSideBar: (showSideBar) => set({ showSideBar: showSideBar }),
    setExpandMap: (expandMap) => set({expandMap : expandMap}),
    setAddingIncident: (addingIncident) => set({addingIncident : addingIncident}),

}));

export default useMapExplorerStore;