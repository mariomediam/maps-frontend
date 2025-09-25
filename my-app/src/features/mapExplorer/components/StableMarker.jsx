import React, { memo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

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

// Componente de marcador completamente estable que no se re-renderiza innecesariamente
const StableMarker = memo(({ 
  incident, 
  isVisible = true, 
  isMobile = false, 
  isSelected = false, 
  onMarkerClick, 
  onMarkerRef,
  markerType = 'visible' // 'visible' o 'invisible'
}) => {
  console.log(`🔒 [StableMarker] Renderizando marcador ${markerType.toUpperCase()}:`, {
    incidentId: incident.id_incident,
    isVisible,
    isSelected,
    isMobile,
    timestamp: new Date().toISOString()
  });

  const handleClick = () => {
    if (!isVisible && markerType === 'invisible') {
      console.log('🚫 [StableMarker] Click ignorado en marcador invisible');
      return;
    }
    
    console.log(`🖱️ [StableMarker] Click en marcador ${markerType}:`, {
      incidentId: incident.id_incident,
      timestamp: new Date().toISOString()
    });
    
    onMarkerClick?.(incident.id_incident);
  };

  const handleRef = (ref) => {
    console.log(`📌 [StableMarker] Ref marcador ${markerType.toUpperCase()}:`, {
      incidentId: incident.id_incident,
      hasRef: !!ref,
      action: ref ? 'mounting' : 'unmounting',
      timestamp: new Date().toISOString()
    });
    
    onMarkerRef?.(incident.id_incident, ref);
  };

  const markerProps = {
    key: `${markerType}-${incident.id_incident}`,
    position: [incident.latitude, incident.longitude],
    icon: getColoredIcon(incident.color_state),
    ref: handleRef,
    eventHandlers: {
      click: handleClick,
      mousedown: handleClick, // Backup
    },
    draggable: false,
  };

  // Controlar visibilidad mediante opacity y zIndex
  if (!isVisible) {
    markerProps.opacity = 0;
    markerProps.zIndexOffset = -1000;
    // En móvil, hacer que los marcadores invisibles no sean clickeables
    if (isMobile) {
      markerProps.eventHandlers = {
        click: () => console.log('🚫 [StableMarker] Click bloqueado en marcador invisible'),
        mousedown: () => console.log('🚫 [StableMarker] Mousedown bloqueado en marcador invisible')
      };
    }
  }

  return (
    <Marker {...markerProps}>
      {/* Solo mostrar popup si es visible y apropiado */}
      {isVisible && (!isMobile || isSelected) && (
        <Popup>
          <div>
            <strong>{incident.summary}</strong>
            {incident.description && (
              <p className="mt-1 text-sm">{incident.description}</p>
            )}
          </div>
        </Popup>
      )}
    </Marker>
  );
}, (prevProps, nextProps) => {
  // Comparación MUY restrictiva - solo re-renderizar si cambia el incidente en sí
  // NO re-renderizar por cambios de visibilidad o selección
  const shouldUpdate = (
    prevProps.incident.id_incident !== nextProps.incident.id_incident ||
    prevProps.incident.color_state !== nextProps.incident.color_state ||
    prevProps.incident.latitude !== nextProps.incident.latitude ||
    prevProps.incident.longitude !== nextProps.incident.longitude ||
    prevProps.incident.summary !== nextProps.incident.summary
  );
  
  // Logging solo si realmente necesita actualización
  if (shouldUpdate) {
    console.log(`🔄 [StableMarker] Re-render CRITICO necesario:`, {
      incidentId: nextProps.incident.id_incident,
      reason: {
        idChanged: prevProps.incident.id_incident !== nextProps.incident.id_incident,
        colorChanged: prevProps.incident.color_state !== nextProps.incident.color_state,
        positionChanged: prevProps.incident.latitude !== nextProps.incident.latitude || prevProps.incident.longitude !== nextProps.incident.longitude,
        summaryChanged: prevProps.incident.summary !== nextProps.incident.summary
      }
    });
  } else {
    // Log cuando NO se re-renderiza (esto debería ser la mayoría de las veces)
    console.log(`✅ [StableMarker] Re-render EVITADO para:`, {
      incidentId: nextProps.incident.id_incident,
      visibilityChanged: prevProps.isVisible !== nextProps.isVisible,
      selectionChanged: prevProps.isSelected !== nextProps.isSelected,
      mobileChanged: prevProps.isMobile !== nextProps.isMobile
    });
  }
  
  return !shouldUpdate; // true = no re-renderizar, false = re-renderizar
});

StableMarker.displayName = 'StableMarker';

export default StableMarker;
