import L from "leaflet";
import { useEffect, useState, useRef } from "react";
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
      // Usar setTimeout para asegurar que el layout se haya actualizado
      setTimeout(() => {
        const markerPosition = [
          incidentSelected.latitude,
          incidentSelected.longitude,
        ];

        // Invalidar el tamaño del mapa y luego centrar
        map.invalidateSize();
        map.setView(markerPosition, 16, { animate: true, duration: 1 });
      }, 150);
    } else if (!incidentSelected && isMobile) {
      // Cuando no hay incidente seleccionado, invalidar tamaño y ajustar vista
      setTimeout(() => {
        map.invalidateSize();
        // Opcional: volver a la vista inicial
        map.setView([-5.1955724, -80.6301423], 14, {
          animate: true,
          duration: 1,
        });
      }, 150);
    }
  }, [incidentSelected, isMobile, map]);

  // Efecto para manejar la expansión/contracción del mapa
  useEffect(() => {
    if (isMobile && incidentSelected) {
      // Usar setTimeout para asegurar que el cambio de layout se haya aplicado
      setTimeout(() => {
        map.invalidateSize();

        // Si está expandido, mantener el centro actual
        if (isMapExpanded) {
          const currentCenter = map.getCenter();
          map.setView([currentCenter.lat, currentCenter.lng], map.getZoom());
        }
      }, 200);
    }
  }, [isMapExpanded, isMobile, incidentSelected, map]);

  return null;
};

// Componente para forzar la inicialización del mapa
const MapInitializer = ({ isMobile }) => {
  const map = useMap();

  useEffect(() => {
    // Inicializar en ambos modos
    setTimeout(() => {
      map.invalidateSize();
      map.getContainer().style.pointerEvents = 'auto';
      
      // Habilitar todas las interacciones
      map.dragging.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
    }, 300);
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

  // Los incidentes ahora se cargan desde MapExplorerPage, no aquí

  // Limpiar marcador temporal al salir de modo adding
  useEffect(() => {
    if (actionType !== MAP_ACTION_TYPES.adding) {
      setTempMarker(null);
    }
  }, [actionType]);

  // Función para abrir popup del marcador seleccionado y centrar mapa
  useEffect(() => {
    if (incidentSelected && markersRef.current[incidentSelected.id_incident]) {
      markersRef.current[incidentSelected.id_incident].openPopup();
    }
  }, [incidentSelected]);

  // Efecto para forzar re-render cuando incidentSelected cambie a null
  useEffect(() => {
    if (incidentSelected === null) {
      setForceRender((prev) => prev + 1);
    }
  }, [incidentSelected]);

  // Efecto para forzar re-render cuando isMobile cambie
  useEffect(() => {
    setForceRender((prev) => prev + 1);
  }, [isMobile]);

  // El centrado del mapa ahora se maneja en MapCenterController

  // Efecto simple para inicializar el mapa
  useEffect(() => {
    const initializeMap = () => {
      if (mapRef.current) {
        setTimeout(() => {
          const map = mapRef.current;
          if (map) {
            map.invalidateSize();
            map.getContainer().style.pointerEvents = 'auto';
          }
        }, 100);
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
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-1000">
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

        {/* Marcadores normales */}
        {actionType !== MAP_ACTION_TYPES.adding && (
          <>
            {incidentsStored.map((incident) => {
              // En móvil: mostrar solo el marcador seleccionado si hay uno seleccionado
              // Si no hay incidente seleccionado (incidentSelected === null), mostrar todos
              const shouldShowMarker =
                !isMobile ||
                incidentSelected === null ||
                incident.id_incident === incidentSelected?.id_incident;

              if (!shouldShowMarker) {
                return null;
              }

              return (
                <Marker
                  key={`${incident.id_incident}-${forceRender}`}
                  position={[incident.latitude, incident.longitude]}
                  icon={getColoredIcon(incident.color_state)}
                  ref={(ref) => {
                    if (ref) {
                      markersRef.current[incident.id_incident] = ref;
                    }
                  }}
                  eventHandlers={{
                    click: () => {
                      // Llamar directamente a la función del store
                      setIncidentSelectedFromStore(incident.id_incident);
                    },
                    mousedown: () => {
                      // Backup: también intentar con mousedown
                      setIncidentSelectedFromStore(incident.id_incident);
                    },
                  }}
                  draggable={false}
                >
                  <Popup>
                    <div>
                      <strong>{incident.summary}</strong>
                      {incident.description && (
                        <p className="mt-1 text-sm">{incident.description}</p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;
