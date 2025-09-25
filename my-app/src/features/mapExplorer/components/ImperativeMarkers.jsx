import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

// Componente que maneja marcadores de forma imperativa, fuera del ciclo de React
const ImperativeMarkers = ({ 
  incidents, 
  incidentSelected, 
  isMobile, 
  onMarkerClick,
  onMarkerRef,
  onMarkersReady
}) => {
  const map = useMap();
  const markersRef = useRef(new Map()); // Map de ID -> marcador Leaflet
  const popupsRef = useRef(new Map()); // Map de ID -> popup Leaflet

  console.log('🔧 [ImperativeMarkers] Renderizando con:', {
    incidentsCount: incidents.length,
    selectedIncidentId: incidentSelected?.id_incident,
    isMobile,
    timestamp: new Date().toISOString()
  });

  // Función para crear ícono colorido
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

  // Función para crear o actualizar un marcador
  const createOrUpdateMarker = (incident) => {
    const incidentId = incident.id_incident;
    const shouldBeVisible = !isMobile || incidentSelected === null || incidentId === incidentSelected?.id_incident;
    const isSelected = incidentId === incidentSelected?.id_incident;

    console.log('🔨 [ImperativeMarkers] Procesando marcador:', {
      incidentId,
      shouldBeVisible,
      isSelected,
      hasExistingMarker: markersRef.current.has(incidentId)
    });

    let marker = markersRef.current.get(incidentId);
    
    if (!marker) {
      // Crear nuevo marcador
      console.log('✨ [ImperativeMarkers] Creando nuevo marcador:', incidentId);
      
      marker = L.marker([incident.latitude, incident.longitude], {
        icon: getColoredIcon(incident.color_state),
        opacity: shouldBeVisible ? 1 : 0,
        zIndexOffset: shouldBeVisible ? 0 : -1000
      });

      // Añadir event listeners
      marker.on('click', () => {
        if (!shouldBeVisible) {
          console.log('🚫 [ImperativeMarkers] Click ignorado - marcador invisible:', incidentId);
          return;
        }
        console.log('🖱️ [ImperativeMarkers] Click en marcador:', incidentId);
        onMarkerClick?.(incidentId);
      });

      marker.on('mousedown', () => {
        if (!shouldBeVisible) {
          console.log('🚫 [ImperativeMarkers] Mousedown ignorado - marcador invisible:', incidentId);
          return;
        }
        console.log('🖱️ [ImperativeMarkers] Mousedown en marcador:', incidentId);
        onMarkerClick?.(incidentId);
      });

      // Crear popup
      const popup = L.popup().setContent(`
        <div>
          <strong>${incident.summary}</strong>
          ${incident.description ? `<p class="mt-1 text-sm">${incident.description}</p>` : ''}
        </div>
      `);
      
      marker.bindPopup(popup);
      
      // Añadir al mapa
      marker.addTo(map);
      
      // Guardar referencias
      markersRef.current.set(incidentId, marker);
      popupsRef.current.set(incidentId, popup);
      
      // Notificar al padre
      onMarkerRef?.(incidentId, marker);
      
      console.log('✅ [ImperativeMarkers] Marcador creado y añadido:', incidentId);
    } else {
      // Actualizar marcador existente
      console.log('🔄 [ImperativeMarkers] Actualizando marcador existente:', incidentId);
      
      // Actualizar visibilidad
      marker.setOpacity(shouldBeVisible ? 1 : 0);
      marker.setZIndexOffset(shouldBeVisible ? 0 : -1000);
      
      // Actualizar ícono si cambió el color
      const currentIcon = marker.getIcon();
      const newIcon = getColoredIcon(incident.color_state);
      if (currentIcon.options.html !== newIcon.options.html) {
        marker.setIcon(newIcon);
        console.log('🎨 [ImperativeMarkers] Ícono actualizado:', incidentId);
      }
      
      // Actualizar posición si cambió
      const currentLatLng = marker.getLatLng();
      if (currentLatLng.lat !== incident.latitude || currentLatLng.lng !== incident.longitude) {
        marker.setLatLng([incident.latitude, incident.longitude]);
        console.log('📍 [ImperativeMarkers] Posición actualizada:', incidentId);
      }
      
      // Actualizar contenido del popup
      const popup = popupsRef.current.get(incidentId);
      if (popup) {
        popup.setContent(`
          <div>
            <strong>${incident.summary}</strong>
            ${incident.description ? `<p class="mt-1 text-sm">${incident.description}</p>` : ''}
          </div>
        `);
      }
    }

    return marker;
  };

  // Función para remover marcadores que ya no existen
  const removeStaleMarkers = (currentIncidentIds) => {
    const existingIds = Array.from(markersRef.current.keys());
    const stalIds = existingIds.filter(id => !currentIncidentIds.includes(id));
    
    stalIds.forEach(incidentId => {
      console.log('🗑️ [ImperativeMarkers] Removiendo marcador obsoleto:', incidentId);
      
      const marker = markersRef.current.get(incidentId);
      if (marker) {
        marker.removeFrom(map);
        markersRef.current.delete(incidentId);
        popupsRef.current.delete(incidentId);
        onMarkerRef?.(incidentId, null);
      }
    });
  };

  // Efecto principal para sincronizar marcadores
  useEffect(() => {
    console.log('🔄 [ImperativeMarkers] Sincronizando marcadores:', {
      incidentsCount: incidents.length,
      existingMarkersCount: markersRef.current.size,
      selectedIncidentId: incidentSelected?.id_incident
    });

    if (!map) {
      console.warn('⚠️ [ImperativeMarkers] Mapa no disponible');
      return;
    }

    // Obtener IDs actuales
    const currentIncidentIds = incidents.map(incident => incident.id_incident);
    
    // Crear/actualizar marcadores para todos los incidentes
    incidents.forEach(incident => {
      createOrUpdateMarker(incident);
    });
    
    // Remover marcadores obsoletos
    removeStaleMarkers(currentIncidentIds);
    
    console.log('✅ [ImperativeMarkers] Sincronización completada');
    
    // Verificar si todos los marcadores están listos
    const expectedMarkers = incidents.length;
    const currentMarkers = markersRef.current.size;
    
    console.log('🔄 [ImperativeMarkers] Estado de marcadores:', {
      currentMarkers,
      expectedMarkers,
      allReady: currentMarkers === expectedMarkers && expectedMarkers > 0
    });
    
    // Notificar cuando todos los marcadores estén listos
    if (currentMarkers === expectedMarkers && expectedMarkers > 0) {
      console.log('✅ [ImperativeMarkers] TODOS los marcadores están sincronizados!');
      
      // Delay adicional en móvil para asegurar que el DOM esté listo
      const notificationDelay = isMobile ? 1500 : 500; // MÁS TIEMPO para móvil
      
      setTimeout(() => {
        console.log('📡 [ImperativeMarkers] Notificando que marcadores están listos');
        onMarkersReady?.();
        
        // 🔑 EJECUTAR SELECCIÓN PENDIENTE SI EXISTE
        if (window.pendingIncidentSelection) {
          const { incidentId, timestamp } = window.pendingIncidentSelection;
          const age = Date.now() - timestamp;
          
          console.log('🎯 [ImperativeMarkers] Ejecutando selección pendiente:', {
            incidentId,
            age: `${age}ms`,
            isMobile
          });
          
          // Delay adicional para asegurar estabilidad completa
          const selectionDelay = isMobile ? 800 : 200;
          
          setTimeout(async () => {
            try {
              // Importar dinámicamente el store para evitar dependencias circulares
              const { useIncidentsStore } = await import('../../../features/incident/store/incidentStore');
              const { setIncidentSelectedFromStore } = useIncidentsStore.getState();
              
              console.log('🚀 [ImperativeMarkers] Ejecutando selección con marcadores estables');
              const success = await setIncidentSelectedFromStore(incidentId);
              
              if (success) {
                console.log('✅ [ImperativeMarkers] Incidente seleccionado exitosamente:', incidentId);
                // Limpiar la selección pendiente
                window.pendingIncidentSelection = null;
              } else {
                console.error('❌ [ImperativeMarkers] Error seleccionando incidente:', incidentId);
              }
            } catch (error) {
              console.error('❌ [ImperativeMarkers] Error crítico en selección:', {
                error: error.message,
                incidentId,
                stack: error.stack
              });
            }
          }, selectionDelay);
        }
      }, notificationDelay);
    }
  }, [incidents, incidentSelected, isMobile, map]);

  // Efecto para manejar apertura de popups
  useEffect(() => {
    if (!incidentSelected || !map) return;

    console.log('🎯 [ImperativeMarkers] Intentando abrir popup:', {
      incidentId: incidentSelected.id_incident,
      hasMarker: markersRef.current.has(incidentSelected.id_incident)
    });

    const marker = markersRef.current.get(incidentSelected.id_incident);
    if (marker) {
      // Delay adaptativo para conexiones lentas
      const connectionType = navigator.connection?.effectiveType || '4g';
      const baseDelay = isMobile ? 300 : 100;
      let multiplier = 1;
      if (connectionType === '3g') multiplier = 2;
      else if (connectionType === '2g') multiplier = 3;
      else if (connectionType === 'slow-2g') multiplier = 4;
      
      const adaptiveDelay = baseDelay * multiplier;
      
      console.log('⏱️ [ImperativeMarkers] Delay adaptativo para popup:', {
        baseDelay,
        connectionType,
        multiplier,
        adaptiveDelay
      });

      setTimeout(() => {
        try {
          if (markersRef.current.has(incidentSelected.id_incident)) {
            marker.openPopup();
            console.log('✅ [ImperativeMarkers] Popup abierto exitosamente:', incidentSelected.id_incident);
          }
        } catch (error) {
          console.error('❌ [ImperativeMarkers] Error abriendo popup:', {
            error: error.message,
            incidentId: incidentSelected.id_incident
          });
        }
      }, adaptiveDelay);
    } else {
      console.warn('⚠️ [ImperativeMarkers] No se encontró marcador para abrir popup:', incidentSelected.id_incident);
    }
  }, [incidentSelected, isMobile]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      console.log('🧹 [ImperativeMarkers] Limpiando marcadores al desmontar');
      markersRef.current.forEach((marker, incidentId) => {
        marker.removeFrom(map);
        onMarkerRef?.(incidentId, null);
      });
      markersRef.current.clear();
      popupsRef.current.clear();
    };
  }, []);

  // Este componente no renderiza nada - todo es imperativo
  return null;
};

export default ImperativeMarkers;
