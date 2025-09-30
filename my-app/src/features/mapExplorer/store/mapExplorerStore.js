import { create } from "zustand";

const useMapExplorerStore = create((set, get) => ({
    showSideBar: false,
    expandMap: false,

    setShowSideBar: (showSideBar) => set({ showSideBar: showSideBar }),
    setExpandMap: (expandMap) => set({expandMap : expandMap})

}));

export default useMapExplorerStore;