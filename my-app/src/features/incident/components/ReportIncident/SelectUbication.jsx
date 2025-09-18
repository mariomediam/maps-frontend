import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';

import LocationPinIcon from "@/shared/assets/icons/LocationPinIcon";

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

function AddMarkerOnDblClick({ setTempMarker }) {
  useMapEvents({
    dblclick(e) {
      
        setTempMarker({ lat: e?.latlng?.lat, lng: e?.latlng?.lng });
      
    },
  });
  return null;
}



const SelectUbication = () => {
  const [tempMarker, setTempMarker] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        // Éxito → guardamos [lat, lng] en el estado
        // setPosition([coords.latitude, coords.longitude]);
        setTempMarker([coords.latitude, coords.longitude]);
        
      },
      (err) => {
        console.error(err);
        alert("No fue posible obtener tu ubicación.");
      },
      {
        enableHighAccuracy: true,  // GPS si está disponible
        timeout: 10000,            // 10 s máx. de espera
        maximumAge: 0,             // Nunca uses caché
      }
    );
  };

  // Detectar si es móvil
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768); // 768px es el breakpoint típico para móvil
    };

    // Verificar al cargar
    checkIsMobile();

    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', checkIsMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return (
    <section className="flex flex-col items-center justify-center">
      <p className="font-bold text-lg text-primary">Ubicación</p>
      <div className="flex flex-col md:flex-row items-center justify-center">
        <p className="text-sm text-primary me-2 mb-1">
          <span className="me-2 mb-1">Haz doble clic en el mapa y arrastra el pin al lugar exacto, o</span>
          <button
            type="button"
            className="text-primary hover:text-secondary border border-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary  rounded-lg text-sm px-3 py-1.5 text-center me-2 mb-2 cursor-pointer"
            onClick={handleLocate}
          >
            <div className="flex gap-2 items-center">
              <LocationPinIcon /> <span> usa mi ubicación actual </span>
            </div>
          </button>
        </p>
      </div>
{/* style={{ height: '100vh', width: '100vw' }} */}
      <div 
        style={{ 
          height: '100vh', 
          width: '100vw', 
          maxWidth: '896px', 
          maxHeight: isMobile ? '300px' : '448px' 
        }} 
        className='flex items-center justify-center max-w-4xl max-h-[448px]'
      >
   
      <MapContainer
        center={[-5.1955724, -80.6301423]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        doubleClickZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AddMarkerOnDblClick setTempMarker={setTempMarker} />
        {/* Marcador temporal al agregar */}
        {tempMarker && (
          <Marker
            position={tempMarker}
            icon={getColoredIcon("#4285F4")}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                setTempMarker(e.target.getLatLng());
              },
            }}
          />
        )}
        
        
      </MapContainer>
    </div>
    </section>
  );
};

export default SelectUbication;
