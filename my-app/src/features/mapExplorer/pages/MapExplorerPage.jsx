import MapSidebar from "@features/mapExplorer/components/MapSidebar";
import MapView from "@features/mapExplorer/components/MapView";
import { useEffect, useState, useRef } from "react";
import MainHeader from "@/shared/components/MainHeader";
import useWindowStore from "@/shared/store/windowStore";
import { initBreakpointListeners } from "@/shared/store/windowStore";
import useIncidentsStore from "@/features/incident/store/incidentStore";
import { useSearchParams } from "react-router-dom";
import FilterIcon from "@/shared/assets/icons/FilterIcon";
import ArrowsMaximizeIcon from "@/shared/assets/icons/ArrowsMaximizeIcon";
import ArrowsMinimizeIcon from "@/shared/assets/icons/ArrowsMinimizeIcon";

const MapExplorerPage = () => {
  const { isMobile } = useWindowStore();
  const [searchParams] = useSearchParams();
  const {
    showMapFilters,
    showMapDetail,
    toggleShowMapFilters,
    setShowMapFilters,
    incidentSelected,
    isMapExpanded,
    toggleMapExpanded,
    initializeMapState,
    searchIncidentsStored,
    incidentsStored,
  } = useIncidentsStore();
  
  // Ref para rastrear si ya se cargaron los incidentes inicialmente
  const hasInitiallyLoaded = useRef(false);
  
  // Estado para rastrear si el store de ventana se ha inicializado
  const [isWindowStoreInitialized, setIsWindowStoreInitialized] = useState(false);
  useEffect(() => {
    const cleanup = initBreakpointListeners();
    
    // Marcar que el store se ha inicializado después de un pequeño delay
    setTimeout(() => {
      setIsWindowStoreInitialized(true);
    }, 100);
    
    return cleanup;
  }, []);

  // Inicializar el estado cuando cambia el modo móvil/desktop
  useEffect(() => {
    if (isWindowStoreInitialized) {
      initializeMapState(isMobile);
    }
  }, [isMobile, initializeMapState, isWindowStoreInitialized]);

  // Cargar incidentes solo una vez al montar la página
  useEffect(() => {
    const loadIncidents = async () => {
      if (!hasInitiallyLoaded.current) {
        try {
          const filters = {};
          const idCategory = searchParams.get("idCategory");
          const idState = searchParams.get("idState");

          if (idCategory) filters.idCategory = idCategory;
          if (idState) filters.idState = idState;

          await searchIncidentsStored(filters);
          hasInitiallyLoaded.current = true;
        } catch (error) {
          console.error("Error cargando incidentes:", error);
        }
      }
    };

    loadIncidents();
  }, []); // Solo se ejecuta una vez al montar

  // Escuchar cambios en searchParams para actualizar filtros
  useEffect(() => {
    const updateIncidentsWithFilters = async () => {
      try {
        const filters = {};
        const idCategory = searchParams.get("idCategory");
        const idState = searchParams.get("idState");

        if (idCategory && idCategory !== "0") filters.idCategory = idCategory;
        if (idState && idState !== "0") filters.idState = idState;

        await searchIncidentsStored(filters);
      } catch (error) {
        console.error("Error actualizando incidentes con filtros:", error);
      }
    };

    // Solo ejecutar si ya se han cargado los incidentes inicialmente
    // Y no hay un incidente seleccionado (para evitar refrescar cuando se selecciona un marcador)
    const shouldUpdate = hasInitiallyLoaded.current && !incidentSelected;

    if (shouldUpdate) {
      updateIncidentsWithFilters();
    }
  }, [searchParams]); // Solo searchParams como dependencia para evitar el bucle

  // No renderizar hasta que el store de ventana esté inicializado
  if (!isWindowStoreInitialized) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <MainHeader />

      {/* Layout principal */}
      <div className="flex flex-1 overflow-hidden">
        {isMobile ? (
          // MODO MÓVIL
          <>
            {showMapFilters && !showMapDetail ? (
              // Solo filtros
              <MapSidebar
                className="w-full h-full"
                onClose={() => setShowMapFilters(false)}
              />
            ) : showMapDetail && incidentSelected ? (
              // Incidente seleccionado: mapa + detalle
              <div className="w-full h-full flex flex-col relative">
                {/* Botón Expandir/Contraer - Fijo en la parte superior */}
                <div className="bg-header-500 p-2 flex items-center justify-center shrink-0 border-1 border-primary">
                  <button
                    type="button"
                    className="text-primary text-sm font-medium cursor-pointer hover:text-primary transition-colors"
                    onClick={toggleMapExpanded}
                  >
                    {isMapExpanded ? (
                      <div className="flex items-center gap-1">
						<ArrowsMinimizeIcon /> <span>Contraer mapa</span>
					  </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <ArrowsMaximizeIcon /> <span>Expandir mapa</span>
                      </div>
                    )}
                  </button>
                </div>

                <MapView
                  className={isMapExpanded ? "w-full flex-1" : "w-full h-1/5"}
                  onToggleFilters={toggleShowMapFilters}
                />
                {!isMapExpanded && (
                  <MapSidebar
                    className="w-full flex-1"
                    onClose={() => setShowMapFilters(false)}
                  />
                )}
              </div>
            ) : (
              // Estado por defecto: solo mapa (incluye casos donde showMapDetail es true pero no hay incidentSelected)
              <div className="w-full h-full flex flex-col relative">
                {/* Botón "Mostrar filtros" - Fijo en la parte superior */}
                <div className="bg-header-500 p-2 flex items-center justify-center shrink-0 border-1 border-primary">
                  <button
                    type="button"
                    className="text-primary text-sm font-medium cursor-pointer hover:text-primary transition-colors"
                    onClick={toggleShowMapFilters}
                  >
                    <div className="flex items-center gap-1">
                      <FilterIcon /> Mostrar filtros
                    </div>
                  </button>
                </div>

                <MapView
                  className="w-full flex-1"
                  onToggleFilters={toggleShowMapFilters}
                />
              </div>
            )}
          </>
        ) : (
          // MODO DESKTOP
          <>
            <MapSidebar
              className="w-1/3 h-full"
              onClose={() => setShowMapFilters(false)}
            />
            <MapView
              className="w-2/3 h-full"
              onToggleFilters={toggleShowMapFilters}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MapExplorerPage;
