import MainHeader from "@shared/components/MainHeader";
import MapSidebar from "@features/mapExplorer/components/MapSidebar";
import MapView from "@features/mapExplorer/components/MapView";
import MapExpander from "@features/mapExplorer/components/MapExpander";
import MapShowSideBar from "@/features/mapExplorer/components/MapShowSideBar";
import { IncidentDetail } from "@features/incident/components/IncidentDetail";
import useIncidentsStore from "@features/incident/store/incidentStore";
import useWindowStore from "@shared/store/windowStore";
import useMapExplorerStore from "@features/mapExplorer/store/mapExplorerStore";
import { initBreakpointListeners } from "@/shared/store/windowStore";
import { useEffect, useState } from "react";

const MapExplorerPage = () => {
  const selectedIncident = useIncidentsStore((state) => state.selectedIncident);
  const setSelectedIncident = useIncidentsStore((state) => state.setSelectedIncident)
  const isMobile = useWindowStore((state) => state.isMobile);
  const [classMapExplor, setClassMapExplor] = useState("");
  const [classMapSidebar, setClassMapSidebar] = useState("");
  const [classMapView, setClassMapView] = useState("");
  const [classIncidentDetail, setClassIncidentDetail] = useState("");
  const [classPage, setClassPage] = useState("");
  const showSideBar = useMapExplorerStore((state) => state.showSideBar);
  const setShowSideBar = useMapExplorerStore((state) => state.setShowSideBar);
  const expandMap = useMapExplorerStore((state) => state.expandMap);
  const setExpandMap = useMapExplorerStore((state) => state.setExpandMap);

  const [showComponentSidebar, setShowComponentSidebar] = useState(true);
  const [showComponentMap, setShowComponentMap] = useState(true);
  const [showComponentShowSidebar, setShowComponentShowSidebar] =
    useState(false);
  const [showComponentDetail, setShowComponentDetail] = useState(false);
  const [showComponentExpander, setShowComponentExpander] = useState(false);

  // Estado para rastrear si el store de ventana se ha inicializado
  const [isWindowStoreInitialized, setIsWindowStoreInitialized] =
    useState(false);
  useEffect(() => {
    const cleanup = initBreakpointListeners();

    // Marcar que el store se ha inicializado después de un pequeño delay
    setTimeout(() => {
      setIsWindowStoreInitialized(true);
    }, 100);

    return cleanup;
  }, []);

  useEffect(() => {
    // component MapSidebar
    let show = false;
    if (!selectedIncident && (!isMobile || showSideBar)) {
      show = true;
    }

    setShowComponentSidebar(show);
  }, [isMobile, showSideBar, selectedIncident]);

  useEffect(() => {
    // component MapView
    let show = false;
    if (!isMobile) {
      show = true;
    } else {
      if (!showSideBar) {
        show = true;
      }
    }
    setShowComponentMap(show);
  }, [isMobile, showSideBar]);

  useEffect(() => {
    //component Detail
    let show = false;
    if (selectedIncident) {
      show = true;
    }
    setShowComponentDetail(show);
  }, [selectedIncident]);

  useEffect(() => {
    //component showSideBar
    let show = false;
    if (isMobile && !selectedIncident && !showSideBar) {
      show = true;
    }
    setShowComponentShowSidebar(show);
  }, [isMobile, selectedIncident, showSideBar]);

  useEffect(() => {
    //component Expander
    let show = false;
    if (isMobile && selectedIncident) {
      show = true;
    }
    setShowComponentExpander(show);
  }, [isMobile, selectedIncident]);

  useEffect(() => {
    // class Page
    let classNamePage = "bg-secondary";
    if (!isMobile) {
      classNamePage = `${classNamePage} flex`;
      if (selectedIncident) {
        classNamePage = `${classNamePage} flex-row-reverse`;
      }
    } else {
      if (showSideBar) {
        classNamePage = `${classNamePage} flex flex-auto`;
      } else {
        classNamePage = `${classNamePage} flex flex-col`;
      }
    }

    setClassPage(classNamePage);
  }, [isMobile, selectedIncident]);

  useEffect(() => {
    // class MapSideBar
    let classNameSideBar = "bg-red-500 text-secondary flex flex-col ";
    if (!isMobile) {
      classNameSideBar = `${classNameSideBar} w-1/4`;
    }
    setClassMapSidebar(classNameSideBar);
  }, [isMobile]);

  useEffect(() => {
    // class MapView
    let classNameMap = "bg-green-500";
    if (!isMobile) {
      classNameMap = `${classNameMap} w-3/4`;
    } else {
      classNameMap = `${classNameMap} flex-auto border-red-500 border-4`;
    }
    setClassMapView(classNameMap);
  }, [isMobile]);

  useEffect(() => {
    // class Detail
    let classNameDetail = "bg-blue-500";
    if (!isMobile) {
      classNameDetail = `${classNameDetail} w-1/4`;
    } else {
      classNameDetail = `${classNameDetail}`;
    }
    setClassIncidentDetail(classNameDetail);
  }, [isMobile]);

  return (
    <div className="h-dvh bg-yellow-400 flex flex-col">
      <MainHeader />

      <ul>
        <li>{isMobile ? "isMobile=true" : "isMobile=false"}</li>
        <li>selectedIncident = {selectedIncident ? "Con valor" : "Nulo"}</li>
        <li>showSideBar= {showSideBar ? "true" : "false"}</li>
        <li>
          {showComponentMap
            ? "showComponentMap=true"
            : "showComponentMap=false"}
        </li>
        <li>showComponentSidebar= {showComponentSidebar ? "true" : "false"}</li>
        <li>classPage={classPage}</li>
        <li>classMapSidebar={classMapSidebar}</li>
        <li>classIncidentDetail={classIncidentDetail}</li>
        <li>classMapView={classMapView}</li>
      </ul>

      <main className={`${classPage} flex-auto`}>
        {showComponentSidebar && (
          <div className={`flex-auto ${classMapSidebar}`}>
            <MapSidebar setShowSideBar={setShowSideBar} isMobile={isMobile} />
          </div>
        )}

        {showComponentShowSidebar && (
          <div className="bg-zinc-700 text-secondary">
            <MapShowSideBar
              showSideBar={showSideBar}
              setShowSideBar={setShowSideBar}
            />
          </div>
        )}

        {showComponentExpander && (
          <div className="bg-purple-500">
            <MapExpander expandMap={expandMap} setExpandMap={setExpandMap}/>
          </div>
        )}

        {showComponentMap && (
          <div className={classMapView}>
            <MapView />
          </div>
        )}

        {showComponentDetail && (
          <div className={`flex-auto ${classIncidentDetail} `}>
            <IncidentDetail isMobile={isMobile} setSelectedIncident={setSelectedIncident} />
          </div>
        )}
      </main>
    </div>
  );
};

export default MapExplorerPage;
