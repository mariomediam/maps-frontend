import L from "leaflet";
import { useEffect, useState, useRef, useMemo } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import FilterIcon from "@/shared/assets/icons/FilterIcon";
import { MAP_ACTION_TYPES } from "@/shared/constants/mapConstants";
import useIncidentsStore from "@/features/incident/store/incidentStore.js";
import useWindowStore from "@/shared/store/windowStore";
import { useNavigate } from "react-router-dom";
import { 
  logConnectionInfo, 
  logDOMOperation, 
  getAdaptiveDelay,
  isSlowMobileConnection 
} from "@/shared/utils/debugUtils";
import StableMarker from "./StableMarker";

// Función para crear un ícono SVG de marcador de posición personalizado
const getColoredIcon = (color) => {
  return L.divIcon({
    className: "",
    html: `
		<svg width="32" height="32" viewBox="0 0 32 32">
		  <path d="M16 2C10.477 2 6 6.477 6 12c0 7.732 8.003 17.292 8.343 17.677a1 1 0 0 0 1.314 0C17.997 29.292 26 19.732 26 12c0-5.523-4.477-10-10-10zm0 13.5A3.5 3.5 0 1 1 16 8a3.5 3.5 0 0 1 0 7.5z" fill="${color}" stroke="#333" stroke-width="2"/>
		</svg>
	  `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const AddMarkerOnDblClick = ({ action, setTempMarker }) => {
  useMapEvents({
    dblclick(e) {
      if (action === MAP_ACTION_TYPES.adding) {
        setTempMarker({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
};

// Componente para manejar el centrado del mapa y redimensionamiento
const MapCenterController = ({ incidentSelected, isMobile, isMapExpanded }) => {
  const map = useMap();

  useEffect(() => {
    if (incidentSelected && isMobile) {
      // Usar delay adaptativo basado en la conexión
      const adaptiveDelay = getAdaptiveDelay(150);
      
      console.log('🎯 [MapCenterController] Centrando mapa en incidente:', {
        incidentId: incidentSelected.id_incident,
        coordinates: [incidentSelected.latitude, incidentSelected.longitude],
        adaptiveDelay,
        isSlowConnection: isSlowMobileConnection()
      });
      
      // Usar setTimeout para asegurar que el layout se haya actualizado
      setTimeout(() => {
        try {
          // Verificar que el mapa y el incidente aún estén disponibles
          if (!map || !map.getContainer || !incidentSelected) {
            console.warn('⚠️ [MapCenterController] Mapa o incidente no disponible');
            return;
          }
          
          const container = map.getContainer();
          if (!container || !container.isConnected) {
            console.warn('⚠️ [MapCenterController] Contenedor del mapa no está conectado');
            return;
          }
          
          const markerPosition = [
            incidentSelected.latitude,
            incidentSelected.longitude,
          ];

          logConnectionInfo('MapCenterController - antes de invalidateSize');
          
          // Verificar que las coordenadas sean válidas
          if (isNaN(markerPosition[0]) || isNaN(markerPosition[1])) {
            console.error('❌ [MapCenterController] Coordenadas inválidas:', markerPosition);
            return;
          }
          
          // Invalidar el tamaño del mapa y luego centrar
          map.invalidateSize();
          
          // Verificar que el mapa aún existe después de invalidateSize
          if (map.setView) {
            map.setView(markerPosition, 16, { animate: true, duration: 1 });
            console.log('✅ [MapCenterController] Mapa centrado exitosamente');
          } else {
            console.error('❌ [MapCenterController] Método setView no disponible');
          }
        } catch (error) {
          console.error('❌ [MapCenterController] Error centrando mapa:', {
            error: error.message,
            stack: error.stack,
            incidentId: incidentSelected?.id_incident,
            hasMap: !!map,
            hasContainer: !!(map?.getContainer),
            containerConnected: map?.getContainer?.()?.isConnected
          });
        }
      }, adaptiveDelay);
    } else if (!incidentSelected && isMobile) {
      const adaptiveDelay = getAdaptiveDelay(150);
      
      console.log('🔄 [MapCenterController] Volviendo a vista inicial');
      
      // Cuando no hay incidente seleccionado, invalidar tamaño y ajustar vista
      setTimeout(() => {
        try {
          logConnectionInfo('MapCenterController - vista inicial');
          
          map.invalidateSize();
          // Opcional: volver a la vista inicial
          map.setView([-5.1955724, -80.6301423], 14, {
            animate: true,
            duration: 1,
          });
          
          console.log('✅ [MapCenterController] Vista inicial establecida');
        } catch (error) {
          console.error('❌ [MapCenterController] Error estableciendo vista inicial:', {
            error: error.message,
            stack: error.stack
          });
        }
      }, adaptiveDelay);
    }
  }, [incidentSelected, isMobile, map]);

  // Efecto para manejar la expansión/contracción del mapa
  useEffect(() => {
    if (isMobile && incidentSelected) {
      const adaptiveDelay = getAdaptiveDelay(200);
      
      console.log('📏 [MapCenterController] Manejando expansión del mapa:', {
        isMapExpanded,
        adaptiveDelay
      });
      
      // Usar setTimeout para asegurar que el cambio de layout se haya aplicado
      setTimeout(() => {
        try {
          logConnectionInfo('MapCenterController - expansión del mapa');
          
          map.invalidateSize();

          // Si está expandido, mantener el centro actual
          if (isMapExpanded) {
            const currentCenter = map.getCenter();
            map.setView([currentCenter.lat, currentCenter.lng], map.getZoom());
          }
          
          console.log('✅ [MapCenterController] Expansión del mapa manejada correctamente');
        } catch (error) {
          console.error('❌ [MapCenterController] Error en expansión del mapa:', {
            error: error.message,
            stack: error.stack,
            isMapExpanded
          });
        }
      }, adaptiveDelay);
    }
  }, [isMapExpanded, isMobile, incidentSelected, map]);

  return null;
};

// Componente para forzar la inicialización del mapa
const MapInitializer = ({ isMobile }) => {
  const map = useMap();

  useEffect(() => {
    const initDelay = getAdaptiveDelay(300);
    
    console.log('🔧 [MapInitializer] Inicializando mapa:', {
      isMobile,
      delay: initDelay,
      isSlowConnection: isSlowMobileConnection(),
      connectionInfo: logConnectionInfo('MapInitializer')
    });
    
    // Inicializar en ambos modos
    setTimeout(() => {
      try {
        const container = map.getContainer();
        
        if (container && container.isConnected) {
          logDOMOperation('invalidateSize', container, 'MapInitializer');
          
          map.invalidateSize();
          container.style.pointerEvents = 'auto';
          
          // Habilitar todas las interacciones con verificación
          const interactions = [
            { name: 'dragging', handler: map.dragging },
            { name: 'touchZoom', handler: map.touchZoom },
            { name: 'doubleClickZoom', handler: map.doubleClickZoom },
            { name: 'scrollWheelZoom', handler: map.scrollWheelZoom },
            { name: 'boxZoom', handler: map.boxZoom },
            { name: 'keyboard', handler: map.keyboard }
          ];
          
          interactions.forEach(({ name, handler }) => {
            try {
              if (handler && handler.enable) {
                handler.enable();
                console.log(`✅ [MapInitializer] ${name} habilitado`);
              } else {
                console.warn(`⚠️ [MapInitializer] ${name} no disponible`);
              }
            } catch (interactionError) {
              console.error(`❌ [MapInitializer] Error habilitando ${name}:`, {
                error: interactionError.message
              });
            }
          });
          
          console.log('✅ [MapInitializer] Mapa inicializado correctamente');
        } else {
          console.error('❌ [MapInitializer] Contenedor del mapa no está disponible:', {
            hasContainer: !!container,
            isConnected: container?.isConnected
          });
        }
      } catch (error) {
        console.error('❌ [MapInitializer] Error crítico en inicialización:', {
          error: error.message,
          stack: error.stack,
          isMobile,
          connectionInfo: logConnectionInfo('Error MapInitializer')
        });
      }
    }, initDelay);
  }, [map, isMobile]);

  return null;
};

const MapView = ({ className, onToggleFilters }) => {
  const position = [51.505, -0.09];

  const [actionType, setActionType] = useState(MAP_ACTION_TYPES.listing);
  const [idProblemSelected, setIdProblemSelected] = useState(null);
  const [tempMarker, setTempMarker] = useState(null);
  const [forceRender, setForceRender] = useState(0); // Para forzar re-render
  const markersRef = useRef({});
  const mapRef = useRef(null);
  const renderTimeoutRef = useRef(null); // Para debounce de re-renders
  const navigate = useNavigate();

  const incidentsStored = useIncidentsStore((state) => state.incidentsStored);
  const isLoading = useIncidentsStore((state) => state.isLoading);
  const setIncidentSelectedFromStore = useIncidentsStore(
    (state) => state.setIncidentSelectedFromStore
  );
  const incidentSelected = useIncidentsStore((state) => state.incidentSelected);
  const isMapExpanded = useIncidentsStore((state) => state.isMapExpanded);
  const toggleMapExpanded = useIncidentsStore(
    (state) => state.toggleMapExpanded
  );
  const isMobile = useWindowStore((state) => state.isMobile);
  const resetIncidentAdded = useIncidentsStore((state) => state.resetIncidentAdded);

  // NUEVA ESTRATEGIA: Renderizar TODOS los marcadores siempre, pero controlar visibilidad individualmente
  // Esto evita completamente el desmontaje/montaje que causa insertBefore
  const stableIncidents = useMemo(() => {
    console.log('🧠 [MapView] Memoización ESTABLE de marcadores:', {
      totalIncidents: incidentsStored.length,
      isMobile,
      selectedIncidentId: incidentSelected?.id_incident,
      timestamp: new Date().toISOString()
    });
    
    return incidentsStored; // Siempre devolver la lista completa sin modificar
  }, [incidentsStored]); // Solo depende de incidentsStored, NO de isMobile ni incidentSelected

  // Los incidentes ahora se cargan desde MapExplorerPage, no aquí

  // Limpiar marcador temporal al salir de modo adding
  useEffect(() => {
    if (actionType !== MAP_ACTION_TYPES.adding) {
      setTempMarker(null);
    }
  }, [actionType]);

  // Función para abrir popup del marcador seleccionado y centrar mapa
  useEffect(() => {
    console.log('🔍 [MapView] Efecto openPopup - Estado:', {
      incidentSelected: incidentSelected?.id_incident,
      hasMarkerRef: !!markersRef.current[incidentSelected?.id_incident],
      isMobile,
      timestamp: new Date().toISOString()
    });
    
    if (incidentSelected && markersRef.current[incidentSelected.id_incident]) {
      // Agregar un pequeño delay para asegurar que el DOM esté estable, especialmente en móvil
      const popupDelay = isMobile ? getAdaptiveDelay(300) : 100;
      
      // Usar requestAnimationFrame para asegurar que el DOM esté estable
      requestAnimationFrame(() => {
        setTimeout(() => {
          try {
            // Verificar que el incidente aún esté seleccionado
            const currentSelected = useIncidentsStore.getState().incidentSelected;
            if (!currentSelected || currentSelected.id_incident !== incidentSelected.id_incident) {
              console.log('ℹ️ [MapView] Incidente ya no está seleccionado, cancelando popup');
              return;
            }
            
            console.log('🎯 [MapView] Intentando abrir popup para incidente:', {
              incidentId: incidentSelected.id_incident,
              delay: popupDelay,
              isSlowConnection: isSlowMobileConnection()
            });
            
            const markerRef = markersRef.current[incidentSelected.id_incident];
            if (markerRef && markerRef.openPopup) {
              // Verificar que el marcador esté en el DOM antes de abrir popup
              const markerElement = markerRef.getElement?.();
              if (markerElement && markerElement.isConnected && markerElement.parentNode) {
                // Verificación adicional: el elemento padre debe existir y estar conectado
                const parentConnected = markerElement.parentNode.isConnected;
                if (parentConnected) {
                  logDOMOperation('openPopup', markerElement, 'MapView popup');
                  markerRef.openPopup();
                  console.log('✅ [MapView] Popup abierto exitosamente');
                } else {
                  console.warn('⚠️ [MapView] Elemento padre del marcador no está conectado:', {
                    hasParent: !!markerElement.parentNode,
                    parentConnected
                  });
                }
              } else {
                console.warn('⚠️ [MapView] Marcador no está conectado al DOM:', {
                  hasElement: !!markerElement,
                  isConnected: markerElement?.isConnected,
                  hasParent: markerElement?.parentNode != null
                });
              }
            } else {
              console.warn('⚠️ [MapView] MarkerRef no tiene método openPopup:', {
                markerRef: !!markerRef,
                hasOpenPopup: !!(markerRef?.openPopup),
                markerRefType: typeof markerRef
              });
            }
          } catch (error) {
            console.error('❌ [MapView] Error al abrir popup del marcador:', {
              error: error.message,
              stack: error.stack,
              incidentId: incidentSelected.id_incident,
              markerExists: !!markersRef.current[incidentSelected.id_incident],
              connectionInfo: logConnectionInfo('Error popup')
            });
            // No hacer nada, continuar normalmente
          }
        }, popupDelay);
      });
    } else {
      console.log('ℹ️ [MapView] No se puede abrir popup:', {
        hasIncidentSelected: !!incidentSelected,
        incidentId: incidentSelected?.id_incident,
        hasMarkerRef: incidentSelected ? !!markersRef.current[incidentSelected.id_incident] : false
      });
    }
  }, [incidentSelected, isMobile]);

  // Efecto para forzar re-render cuando incidentSelected cambie a null (con debounce)
  useEffect(() => {
    if (incidentSelected === null) {
      // Limpiar timeout anterior si existe
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
      
      // Debounce el re-render para evitar múltiples actualizaciones rápidas
      renderTimeoutRef.current = setTimeout(() => {
        console.log('🔄 [MapView] Forzando re-render por incidentSelected = null');
        setForceRender((prev) => prev + 1);
      }, 100);
    }
    
    // Cleanup
    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, [incidentSelected]);

  // Efecto para forzar re-render cuando isMobile cambie (con debounce)
  useEffect(() => {
    // Limpiar timeout anterior si existe
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }
    
    // Debounce el re-render
    renderTimeoutRef.current = setTimeout(() => {
      console.log('🔄 [MapView] Forzando re-render por cambio de isMobile');
      setForceRender((prev) => prev + 1);
    }, 150);
    
    // Cleanup
    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, [isMobile]);

  // El centrado del mapa ahora se maneja en MapCenterController

  // Efecto simple para inicializar el mapa
  useEffect(() => {
    console.log('🗺️ [MapView] Inicializando mapa:', {
      hasMapRef: !!mapRef.current,
      isMobile,
      timestamp: new Date().toISOString()
    });
    
    const initializeMap = () => {
      if (mapRef.current) {
        const initDelay = getAdaptiveDelay(100);
        
        setTimeout(() => {
          try {
            const map = mapRef.current;
            if (map) {
              console.log('✅ [MapView] Invalidando tamaño del mapa e inicializando...', {
                delay: initDelay,
                connectionInfo: logConnectionInfo('Inicialización mapa')
              });
              
              const container = map.getContainer();
              if (container && container.isConnected) {
                logDOMOperation('invalidateSize', container, 'MapView inicialización');
                map.invalidateSize();
                container.style.pointerEvents = 'auto';
                console.log('✅ [MapView] Mapa inicializado correctamente');
              } else {
                console.warn('⚠️ [MapView] Contenedor del mapa no está conectado al DOM:', {
                  hasContainer: !!container,
                  isConnected: container?.isConnected
                });
              }
            } else {
              console.warn('⚠️ [MapView] MapRef existe pero no tiene instancia del mapa');
            }
          } catch (error) {
            console.error('❌ [MapView] Error inicializando mapa:', {
              error: error.message,
              stack: error.stack,
              connectionInfo: logConnectionInfo('Error inicialización')
            });
          }
        }, initDelay);
      } else {
        console.warn('⚠️ [MapView] No hay referencia al mapa para inicializar');
      }
    };

    initializeMap();
  }, []);

  const MapContainerOnClick = ({ opcion = "null" }) => {
    useMapEvents({
      click(e) {
        // No limpiar selección si el mapa está expandido en móvil
        if (isMobile && isMapExpanded) {
          return;
        }

        // No limpiar si hay un incidente seleccionado en móvil (pero no expandido)
        if (isMobile && incidentSelected && !isMapExpanded) {
          return;
        }

        // Solo limpiar selección en casos específicos
        setIncidentSelectedFromStore(opcion);
      },
    });
    return null;
  };

  const handleReportIncident = () => {
    resetIncidentAdded();
    navigate('/add-incident');
  };

  return (
    <div className={`w-full relative ${className}`}>
      {/* Overlay de loading */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-1000">
          <div className="bg-white rounded-lg p-6 shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mb-3"></div>
            <p className="text-sm text-gray-600">Cargando incidentes...</p>
          </div>
        </div>
      )}


      {/* Botón "Reportar una incidencia" - Flotante sobre el mapa */}
      {(!isMobile || !incidentSelected) && (
        <div className={`absolute left-1/2 transform -translate-x-1/2 z-1000 ${
          isMobile ? 'bottom-16 mobile-bottom-button' : 'bottom-6'
        }`}>
          <button
            type="button"
            className="bg-primary text-secondary px-6 py-3 rounded-lg shadow-lg hover:bg-black hover:font-bold transition-colors font-medium text-sm"
            onClick={handleReportIncident}
          >
            Reportar una incidencia
          </button>
        </div>
      )}

      <MapContainer
        ref={mapRef}
        center={[-5.1955724, -80.6301423]}
        zoom={14}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", opacity: 1 }}
        doubleClickZoom={false}
        className={isLoading ? "pointer-events-none" : ""}
        // Configuraciones para mejorar la respuesta de los clics
        tap={true}
        tapTolerance={15}
        touchZoom={true}
        bounceAtZoomLimits={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapInitializer isMobile={isMobile} />
        <MapCenterController
          incidentSelected={incidentSelected}
          isMobile={isMobile}
          isMapExpanded={isMapExpanded}
        />
        <AddMarkerOnDblClick
          action={actionType}
          setTempMarker={setTempMarker}
        />
        <MapContainerOnClick opcion="null" />
        {/* Marcador temporal al agregar */}
        {actionType === MAP_ACTION_TYPES.adding && tempMarker && (
          <Marker
            position={tempMarker}
            icon={getColoredIcon("#C82333")}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                setTempMarker(e.target.getLatLng());
              },
            }}
          />
        )}

        {/* Marcadores normales - ESTRATEGIA DEFINITIVA: Renderizar condicionalmente sin cambiar props */}
        {actionType !== MAP_ACTION_TYPES.adding && (
          <>
            {/* ESTRATEGIA DEFINITIVA: Renderizar TODOS los marcadores siempre, nunca desmontar */}
            {stableIncidents.map((incident) => {
              // Calcular visibilidad dinámicamente pero SIN afectar el renderizado
              const shouldBeVisible = !isMobile || incidentSelected === null || incident.id_incident === incidentSelected?.id_incident;
              const isSelected = incident.id_incident === incidentSelected?.id_incident;
              
              console.log('🔒 [MapView] Renderizando marcador ULTRA-ESTABLE:', {
                incidentId: incident.id_incident,
                shouldBeVisible,
                isSelected,
                isMobile,
                timestamp: new Date().toISOString()
              });
              
              return (
                <StableMarker
                  key={`ultra-stable-${incident.id_incident}`} // Clave que NUNCA cambia
                  incident={incident}
                  isVisible={shouldBeVisible}
                  isMobile={isMobile}
                  isSelected={isSelected}
                  markerType="ultra-stable" // Tipo que nunca cambia
                  onMarkerClick={(incidentId) => {
                    // Solo permitir clicks si es visible
                    if (!shouldBeVisible) {
                      console.log('🚫 [MapView] Click ignorado - marcador no visible:', incidentId);
                      return;
                    }
                    
                    console.log('🎯 [MapView] Click en marcador ultra-estable:', incidentId);
                    try {
                      const { clearNewlyCreatedIncident } = useIncidentsStore.getState();
                      clearNewlyCreatedIncident();
                      const result = setIncidentSelectedFromStore(incidentId);
                      console.log('✅ [MapView] Incidente seleccionado exitosamente:', {
                        incidentId,
                        success: result
                      });
                    } catch (error) {
                      console.error('❌ [MapView] Error en click ultra-estable:', {
                        error: error.message,
                        incidentId
                      });
                    }
                  }}
                  onMarkerRef={(incidentId, ref) => {
                    try {
                      if (ref) {
                        markersRef.current[incidentId] = ref;
                        console.log('✅ [MapView] Ref ultra-estable guardada:', incidentId);
                      } else {
                        // Solo limpiar si realmente se desmonta (lo cual no debería pasar)
                        if (markersRef.current[incidentId]) {
                          delete markersRef.current[incidentId];
                          console.log('🗑️ [MapView] Ref ultra-estable limpiada:', incidentId);
                        }
                      }
                    } catch (error) {
                      console.error('❌ [MapView] Error en ref ultra-estable:', {
                        error: error.message,
                        incidentId
                      });
                    }
                  }}
                />
              );
            })}
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;
