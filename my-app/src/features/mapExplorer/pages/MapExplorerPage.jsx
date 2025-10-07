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
  const isLoadingSearchIncidents = useIncidentsStore((state) => state.isLoading);

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
  if (isLoadingSearchIncidents) {
    return (
      <div className="h-dvh flex bg-secondary items-center justify-center gap-2">
        <div role="status">
    <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
</div>
        <div className="text-lg">Cargando incidencias...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-dvh flex items-center justify-center">
        <div className="text-red-600 text-lg">Error: {error}</div>
      </div>
    );
  }



  return (
    <div className="h-dvh flex flex-col">
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
          <div className=" text-secondary">
            <MapShowSideBar
              showSideBar={showSideBar}
              setShowSideBar={setShowSideBar}
            />
          </div>
        )}

        {componentVisibility.expander && (
          <div className="">
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
            <div className="text-lg">Cargando incidencias...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapExplorerPage;
