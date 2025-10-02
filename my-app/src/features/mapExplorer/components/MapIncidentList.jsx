import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import useIncidentsStore from "@features/incident/store/incidentStore";

export const MapIncidentList = ({
  isMobile,
  selectedIncident,
  setSelectedIncident,
}) => {
  const incidentsStored = useIncidentsStore((state) => state.incidentsStored);

  const [incidentsToShow, setIncidentsToShow] = useState([]);
  const mapRef = useRef();

  useEffect(() => {
    setIncidentsToShow(incidentsStored);
  }, [incidentsStored]);

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

  const incindentClick = (incident) => {
    setSelectedIncident(incident);
  };

  return (
    <>
      <MapContainer
        center={[-5.1955724, -80.6301423]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        doubleClickZoom={false}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <>
          {incidentsStored.map((incident) => (
            <Marker
              key={incident.id_incident}
              position={[incident.latitude, incident.longitude]}
              icon={getColoredIcon(incident.color_state)}
              eventHandlers={{
                click: () => incindentClick(incident),
                //   popupclose: () => setAction(typeAction.listing)
              }}
            >
              <Popup>{incident.summary}</Popup>
            </Marker>
          ))}
        </>
      </MapContainer>
    </>
  );
};
