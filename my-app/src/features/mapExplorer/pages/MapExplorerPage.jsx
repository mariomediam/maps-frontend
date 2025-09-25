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
import { toast } from "sonner";

const MapExplorerPage = () => {
  const { isMobile } = useWindowStore();
  const [searchParams, setSearchParams] = useSearchParams();
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
    setIncidentSelectedFromStore,
    newlyCreatedIncidentId,
    clearNewlyCreatedIncident,
  } = useIncidentsStore();
  
  // Ref para rastrear si ya se cargaron los incidentes inicialmente
  const hasInitiallyLoaded = useRef(false);
  // Ref para rastrear si ya se procesó el incidente recién creado
  const hasProcessedNewIncident = useRef(false);
  
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
          console.log('🔄 [MapExplorerPage] Cargando incidentes iniciales:', {
            hasInitiallyLoaded: hasInitiallyLoaded.current,
            connectionType: navigator.connection?.effectiveType || 'unknown',
            timestamp: new Date().toISOString()
          });
          
          const filters = {};
          const idCategory = searchParams.get("idCategory");
          const idState = searchParams.get("idState");

          if (idCategory) filters.idCategory = idCategory;
          if (idState) filters.idState = idState;

          console.log('🔍 [MapExplorerPage] Filtros aplicados:', filters);
          const incidents = await searchIncidentsStored(filters);
          hasInitiallyLoaded.current = true;
          
          console.log('✅ [MapExplorerPage] Incidentes cargados exitosamente:', {
            count: incidents?.length || 0,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          console.error('❌ [MapExplorerPage] Error cargando incidentes:', {
            error: error.message,
            stack: error.stack,
            connectionType: navigator.connection?.effectiveType || 'unknown',
            timestamp: new Date().toISOString()
          });
        }
      } else {
        console.log('ℹ️ [MapExplorerPage] Incidentes ya cargados previamente');
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

  // Detectar y procesar el incidente recién creado desde el store
  useEffect(() => {
    const processNewlyCreatedIncident = async () => {
      console.log('🎯 [MapExplorerPage] Estado del procesamiento de incidente nuevo:', {
        newlyCreatedIncidentId,
        hasInitiallyLoaded: hasInitiallyLoaded.current,
        hasProcessedNewIncident: hasProcessedNewIncident.current,
        incidentsCount: incidentsStored.length,
        isMobile,
        connectionType: navigator.connection?.effectiveType || 'unknown',
        timestamp: new Date().toISOString()
      });
      
      // Verificación más estricta para evitar bucles
      if (newlyCreatedIncidentId && 
          !hasProcessedNewIncident.current) {
        
        // Marcar inmediatamente como en proceso para evitar ejecuciones múltiples
        hasProcessedNewIncident.current = true;
        
        try {
          console.log(`🔄 [MapExplorerPage] Procesando incidente recién creado: ${newlyCreatedIncidentId}`);
          
          // Detectar si estamos en producción
          const isProduction = window.location.hostname !== 'localhost';
          
          console.log('🌍 [MapExplorerPage] Entorno detectado:', {
            isProduction,
            hostname: window.location.hostname,
            connectionType: navigator.connection?.effectiveType || 'unknown'
          });
          
          // Agregar un delay inicial en producción para dar tiempo a la API
          if (isProduction) {
            console.log('⏳ [MapExplorerPage] Esperando delay inicial para producción (2000ms)...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('✅ [MapExplorerPage] Delay inicial completado');
          }
          
          // Función para esperar hasta que el incidente esté disponible
          const waitForIncident = async (maxAttempts = 10, delay = isProduction ? 1500 : 1000) => {
            for (let attempt = 0; attempt < maxAttempts; attempt++) {
              // Obtener el estado actual del store
              const currentState = useIncidentsStore.getState();
              const incident = currentState.incidentsStored.find(inc => 
                inc.id_incident === newlyCreatedIncidentId
              );
              
              if (incident) {
                console.log(`✅ [MapExplorerPage] Incidente encontrado en intento ${attempt + 1}:`, {
                  incidentId: incident.id_incident,
                  summary: incident.summary,
                  hasCoordinates: !!(incident.latitude && incident.longitude)
                });
                return incident;
              }
              
              // Si no se encuentra, recargar los incidentes
              console.log(`🔄 [MapExplorerPage] Intento ${attempt + 1}: Incidente no encontrado, recargando...`, {
                currentIncidentsCount: currentState.incidentsStored.length,
                searchingFor: newlyCreatedIncidentId
              });
              
              try {
                await currentState.searchIncidentsStored({});
                console.log(`✅ [MapExplorerPage] Incidentes recargados en intento ${attempt + 1}`);
              } catch (reloadError) {
                console.error(`❌ [MapExplorerPage] Error recargando incidentes en intento ${attempt + 1}:`, {
                  error: reloadError.message,
                  connectionType: navigator.connection?.effectiveType || 'unknown'
                });
              }
              
              // Marcar que se ha cargado inicialmente después de la primera recarga
              if (!hasInitiallyLoaded.current) {
                hasInitiallyLoaded.current = true;
              }
              
              if (attempt < maxAttempts - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
              }
            }
            return null;
          };
          
          // Esperar hasta que el incidente esté disponible
          const incident = await waitForIncident();
          
          if (incident) {
            // Obtener las funciones del store de manera segura
            const { setIncidentSelectedFromStore, clearNewlyCreatedIncident } = useIncidentsStore.getState();
            
            // En móvil, agregar un delay adicional para evitar conflictos de DOM
            const { isMobile } = useWindowStore.getState();
            const selectionDelay = isMobile ? 500 : 100;
            
            setTimeout(async () => {
              try {
                console.log(`🎯 [MapExplorerPage] Seleccionando incidente recién creado:`, {
                  incidentId: newlyCreatedIncidentId,
                  delay: selectionDelay,
                  isMobile
                });
                
                const success = await setIncidentSelectedFromStore(newlyCreatedIncidentId);
                
                if (success) {
                  console.log("✅ [MapExplorerPage] Incidente seleccionado correctamente:", newlyCreatedIncidentId);
                } else {
                  console.error("❌ [MapExplorerPage] Fallo al seleccionar el incidente:", newlyCreatedIncidentId);
                }
              } catch (selectionError) {
                console.error("❌ [MapExplorerPage] Error durante la selección del incidente:", {
                  error: selectionError.message,
                  stack: selectionError.stack,
                  incidentId: newlyCreatedIncidentId
                });
              }
            }, selectionDelay);
            
            // Limpiar el ID del store después de procesarlo
            setTimeout(() => {
              clearNewlyCreatedIncident();
            }, selectionDelay + 1000);
          } else {
            console.error("❌ [MapExplorerPage] No se pudo encontrar el incidente recién creado después de múltiples intentos:", {
              searchedFor: newlyCreatedIncidentId,
              totalIncidents: useIncidentsStore.getState().incidentsStored.length,
              connectionType: navigator.connection?.effectiveType || 'unknown',
              timestamp: new Date().toISOString()
            });
            // Resetear la bandera para permitir reintentos futuros
            hasProcessedNewIncident.current = false;
            // Limpiar el ID incluso si no se encontró para evitar bucles infinitos
            const { clearNewlyCreatedIncident } = useIncidentsStore.getState();
            clearNewlyCreatedIncident();
          }
          
        } catch (error) {
          console.error("❌ [MapExplorerPage] Error crítico al seleccionar incidente recién creado:", {
            error: error.message,
            stack: error.stack,
            incidentId: newlyCreatedIncidentId,
            connectionType: navigator.connection?.effectiveType || 'unknown',
            timestamp: new Date().toISOString()
          });
          // Resetear la bandera para permitir reintentos futuros
          hasProcessedNewIncident.current = false;
          // Limpiar el ID en caso de error para evitar bucles infinitos
          const { clearNewlyCreatedIncident } = useIncidentsStore.getState();
          clearNewlyCreatedIncident();
        }
      }
    };

    processNewlyCreatedIncident();
  }, [newlyCreatedIncidentId]); // Solo depender del ID del incidente recién creado

  // Resetear la bandera cuando no hay incidente recién creado
  useEffect(() => {
    if (!newlyCreatedIncidentId) {
      hasProcessedNewIncident.current = false;
    }
  }, [newlyCreatedIncidentId]);

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
