import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export const MapIncidentSelected = ({ isMobile, selectedIncident }) => {
  // Componente para controlar el centro del mapa después del redimensionamiento
  const MapController = ({ isMobile, selectedIncident }) => {
    const map = useMap();

    useEffect(() => {
      if (isMobile) {
        // Primero invalida el tamaño del mapa para que Leaflet recalcule las dimensiones

        if (selectedIncident) {
          map.invalidateSize();

          // Espera un momento para que el redimensionamiento se complete
          const timeoutId = setTimeout(() => {
            map.setView(
              [selectedIncident.latitude, selectedIncident.longitude],
              16,
              { animate: true, duration: 1 }
            );
          }, 100); // 100ms de delay para asegurar que el redimensionamiento se complete

          return () => clearTimeout(timeoutId);
        }
      }
    }, [map, isMobile, selectedIncident]);

    return null;
  };

  function getColoredIcon(color) {
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
  }

  if (!selectedIncident) {
    return <></>;
  }

   return (
    <>
      <MapContainer
        center={[selectedIncident.latitude, selectedIncident.longitude]}
        zoom={16}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        doubleClickZoom={false}        
      >
        <MapController
          isMobile={isMobile}
          selectedIncident={selectedIncident}
        />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <>
          <Marker
            position={[selectedIncident.latitude, selectedIncident.longitude]}
            icon={getColoredIcon(selectedIncident.color_state)}
          >
            <Popup>{selectedIncident.summary}</Popup>
          </Marker>
        </>
      </MapContainer>
    </>
  );
};
