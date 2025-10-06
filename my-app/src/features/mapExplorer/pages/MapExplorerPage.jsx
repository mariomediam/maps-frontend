import { useEffect } from "react";
import MainHeader from "@shared/components/MainHeader";
import MapSidebar from "@features/mapExplorer/components/MapSidebar";
import MapView from "@features/mapExplorer/components/MapView";
import MapExpander from "@features/mapExplorer/components/MapExpander";
import MapShowSideBar from "@/features/mapExplorer/components/MapShowSideBar";
import { IncidentDetail } from "@features/incident/components/IncidentDetail";
import useIncidentsStore from "@features/incident/store/incidentStore";
import useWindowStore from "@shared/store/windowStore";
import useMapExplorerStore from "@features/mapExplorer/store/mapExplorerStore";
import { useMapLayout } from "../hooks/useMapLayout";
import { useIncidentLoader } from "../hooks/useIncidentLoader";
import { useBreakpointInit } from "../hooks/useBreakpointInit";
import { useSearchParams } from "react-router-dom";

const MapExplorerPage = () => {
  // URL search params
  const [searchParams] = useSearchParams();
  const incidentIdFromUrl = searchParams.get('idIncident');

  // Store selectors
  const selectedIncident = useIncidentsStore((state) => state.selectedIncident);
  const setSelectedIncident = useIncidentsStore((state) => state.setSelectedIncident);
  const isMobile = useWindowStore((state) => state.isMobile);
  const showSideBar = useMapExplorerStore((state) => state.showSideBar);
  const setShowSideBar = useMapExplorerStore((state) => state.setShowSideBar);
  const expandMap = useMapExplorerStore((state) => state.expandMap);
  const setExpandMap = useMapExplorerStore((state) => state.setExpandMap);
  const addingIncident = useMapExplorerStore((state) => state.addingIncident);
  const setAddingIncident = useMapExplorerStore((state) => state.setAddingIncident);

  // Custom hooks
  useBreakpointInit();
  const { isLoading, error } = useIncidentLoader({incidentIdFromUrl});
  const { componentVisibility, cssClasses, isInitialized } = useMapLayout({
    isMobile,
    selectedIncident,
    showSideBar,
    expandMap
  });

  // useEffect(() => {
  //   if (incidentIdFromUrl) {
  //     setSelectedIncident(incidentIdFromUrl);
  //   }
  // }, [incidentIdFromUrl, setSelectedIncident]);

  // Loading state
  if (!isInitialized) {
    return (
      <div className="h-dvh bg-yellow-400 flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-dvh bg-yellow-400 flex items-center justify-center">
        <div className="text-red-600 text-lg">Error: {error}</div>
      </div>
    );
  }



  return (
    <div className="h-dvh bg-yellow-400 flex flex-col">
      <MainHeader />
      {/* <ul>
        <li>cssClasses.page: {cssClasses.page}</li>
        <li>cssClasses.sidebar: {cssClasses.sidebar}</li>
        <li>cssClasses.incidentDetail: {cssClasses.incidentDetail}</li>
        <li>cssClasses.mapView: {cssClasses.mapView}</li>

      </ul> */}
      <main className={cssClasses.page}>
        {componentVisibility.sidebar && (
          <div className={cssClasses.sidebar}>
            <MapSidebar setShowSideBar={setShowSideBar} isMobile={isMobile} />
          </div>
        )}

        {componentVisibility.showSidebarButton && (
          <div className="bg-zinc-700 text-secondary">
            <MapShowSideBar
              showSideBar={showSideBar}
              setShowSideBar={setShowSideBar}
            />
          </div>
        )}

        {componentVisibility.expander && (
          <div className="bg-purple-500">
            <MapExpander expandMap={expandMap} setExpandMap={setExpandMap} />
          </div>
        )}

        {componentVisibility.map && (
          <div className={cssClasses.mapView}>
            <MapView isMobile={isMobile} selectedIncident={selectedIncident} setSelectedIncident={setSelectedIncident} />
          </div>
        )}

        {componentVisibility.detail && (
          <div className={cssClasses.incidentDetail}>
            <IncidentDetail 
              isMobile={isMobile} 
              setSelectedIncident={setSelectedIncident} 
              setExpandMap={setExpandMap}
              incident={selectedIncident}
            />
          </div>
        )}
      </main>


      
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <div className="text-lg">Cargando incidentes...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapExplorerPage;
