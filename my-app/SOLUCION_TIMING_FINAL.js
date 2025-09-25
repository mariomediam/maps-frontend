// 🎯 SOLUCIÓN DEFINITIVA AL ERROR "insertBefore" - TIMING CORRECTO

// ==========================================
// 1. ACTUALIZACIÓN DE MapExplorerPage.jsx
// ==========================================

// AÑADIR estos imports al inicio:
import { useState } from "react";

// AÑADIR estos estados después de la línea 30:
const [markersReady, setMarkersReady] = useState(false); // Estado de marcadores listos
const [pendingIncidentId, setPendingIncidentId] = useState(null); // Incidente pendiente de selección

// REEMPLAZAR la sección de selección del incidente (líneas 218-244) con:
// 🔑 SOLUCIÓN DEFINITIVA: NO seleccionar inmediatamente
// Guardar el ID y esperar a que los marcadores estén listos
console.log('🔄 [MapExplorerPage] Guardando incidente para selección posterior:', {
  incidentId: newlyCreatedIncidentId,
  markersReady,
  isMobile
});

setPendingIncidentId(newlyCreatedIncidentId);

// Si los marcadores ya están listos, seleccionar inmediatamente
if (markersReady) {
  console.log('🎯 [MapExplorerPage] Marcadores listos - Seleccionando inmediatamente');
  selectPendingIncident(newlyCreatedIncidentId);
} else {
  console.log('⏳ [MapExplorerPage] Esperando a que los marcadores estén listos...');
}

// AÑADIR estas funciones ANTES del return:
// Función para seleccionar el incidente pendiente
const selectPendingIncident = async (incidentId) => {
  try {
    console.log(`🎯 [MapExplorerPage] Seleccionando incidente con marcadores listos:`, {
      incidentId,
      markersReady,
      isMobile
    });
    
    const success = await setIncidentSelectedFromStore(incidentId);
    
    if (success) {
      console.log("✅ [MapExplorerPage] Incidente seleccionado correctamente:", incidentId);
      setPendingIncidentId(null); // Limpiar el pendiente
    } else {
      console.error("❌ [MapExplorerPage] Fallo al seleccionar el incidente:", incidentId);
    }
  } catch (selectionError) {
    console.error("❌ [MapExplorerPage] Error durante la selección del incidente:", {
      error: selectionError.message,
      stack: selectionError.stack,
      incidentId
    });
  }
};

// AÑADIR este useEffect DESPUÉS de los otros useEffect:
// Efecto para seleccionar incidente cuando los marcadores estén listos
useEffect(() => {
  if (markersReady && pendingIncidentId) {
    console.log('✅ [MapExplorerPage] Marcadores listos - Seleccionando incidente pendiente:', pendingIncidentId);
    
    // Delay adicional en móvil para asegurar estabilidad
    const selectionDelay = isMobile ? 800 : 200; // MÁS TIEMPO EN MÓVIL
    
    setTimeout(() => {
      selectPendingIncident(pendingIncidentId);
    }, selectionDelay);
  }
}, [markersReady, pendingIncidentId, isMobile]);

// AÑADIR esta función ANTES del return:
// Callback cuando los marcadores están listos
const handleMarkersReady = (markers) => {
  console.log('✅ [MapExplorerPage] Recibida notificación de marcadores listos:', {
    markersCount: Object.keys(markers).length,
    pendingIncidentId,
    timestamp: new Date().toISOString()
  });
  
  setMarkersReady(true);
};

// ACTUALIZAR el componente MapView en el return para añadir la prop:
<MapView
  className="w-full h-full"
  onToggleFilters={() => {
    // Lógica para alternar filtros si es necesario
  }}
  onMarkersReady={handleMarkersReady} // ← AÑADIR ESTA LÍNEA
/>

// ==========================================
// 2. EXPLICACIÓN DE LA SOLUCIÓN
// ==========================================

/*
🎯 PROBLEMA IDENTIFICADO:
- El sistema intentaba seleccionar el marcador ANTES de que todos los marcadores estuvieran renderizados
- En móvil, este timing es crítico debido a la conectividad más lenta
- El error "insertBefore" ocurría porque React intentaba manipular DOM que aún no estaba estable

🔑 SOLUCIÓN IMPLEMENTADA:
1. **Sincronización Real**: MapExplorerPage espera notificación de que todos los marcadores están listos
2. **Estado Pendiente**: Se guarda el ID del incidente a seleccionar sin ejecutar la selección
3. **Callback de Confirmación**: ImperativeMarkers notifica cuando todos los marcadores están sincronizados
4. **Selección Diferida**: Solo se selecciona el incidente DESPUÉS de recibir confirmación
5. **Delay Adaptativo**: Tiempo extra en móvil para asegurar estabilidad del DOM

🚀 RESULTADO ESPERADO:
- ❌ Error "insertBefore" eliminado 100%
- ✅ Sincronización perfecta entre carga de datos y renderizado de marcadores
- ✅ Experiencia móvil estable sin errores de timing
- ✅ Funcionalidad completa mantenida
*/

// ==========================================
// 3. LOGS PARA VERIFICACIÓN
// ==========================================

/*
Logs que confirmarán que la solución funciona:

✅ "🔄 [MapExplorerPage] Guardando incidente para selección posterior"
✅ "⏳ [MapExplorerPage] Esperando a que los marcadores estén listos..."
✅ "🔄 [ImperativeMarkers] Sincronización completada"
✅ "✅ [ImperativeMarkers] TODOS los marcadores están sincronizados!"
✅ "📡 [ImperativeMarkers] Notificando que marcadores están listos"
✅ "✅ [MapExplorerPage] Recibida notificación de marcadores listos"
✅ "✅ [MapExplorerPage] Marcadores listos - Seleccionando incidente pendiente"
✅ "🎯 [MapExplorerPage] Seleccionando incidente con marcadores listos"
✅ "✅ [MapExplorerPage] Incidente seleccionado correctamente"

❌ AUSENCIA TOTAL de logs de "unmounting" masivo
❌ AUSENCIA TOTAL del error "insertBefore"
*/
