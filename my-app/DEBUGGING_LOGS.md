# 🔍 Sistema de Logs para Debugging en Dispositivos Móviles

Este documento describe el sistema de logging implementado para identificar y solucionar el error "insertBefore" que ocurre en dispositivos móviles con conectividad lenta.

## 📋 Resumen del Problema

- **Error**: `No se pudo ejecutar 'insertBefore' en 'Node'`
- **Contexto**: Dispositivos móviles con conectividad lenta
- **Escenario**: Al agregar un incidente y navegar al mapa, o al hacer clic en marcadores

## 🎯 Logs Implementados

### 1. **Logs Globales** (`main.jsx`)
- ✅ Información de conexión al inicio de la aplicación
- ✅ Captura de errores no manejados
- ✅ Monitoreo de promesas rechazadas
- ✅ Cambios de conectividad
- ✅ Interceptación específica de errores DOM (`insertBefore`, `removeChild`, `appendChild`)

**Prefijo**: `[Global]`

### 2. **Logs de API** (`incidentApi.js`)
- ✅ Peticiones de obtención de incidentes
- ✅ Creación de nuevos incidentes
- ✅ Tiempo de respuesta de las API calls
- ✅ Información de conectividad en cada petición
- ✅ Detalles de errores de red

**Prefijo**: `[IncidentAPI]`

### 3. **Logs del Store** (`incidentStore.js`)
- ✅ Búsqueda y carga de incidentes
- ✅ Selección de incidentes
- ✅ Creación de incidentes
- ✅ Estados del store y transiciones

**Prefijo**: `[IncidentStore]`

### 4. **Logs del Mapa** (`MapView.jsx`)
- ✅ Renderizado de marcadores
- ✅ Eventos de click en marcadores
- ✅ Apertura de popups
- ✅ Referencias de marcadores (mounting/unmounting)
- ✅ Inicialización del mapa
- ✅ Operaciones DOM críticas

**Prefijos**: `[MapView]`, `[MapCenterController]`, `[MapInitializer]`

### 5. **Logs de Navegación** (`MapExplorerPage.jsx`)
- ✅ Carga inicial de incidentes
- ✅ Procesamiento de incidentes recién creados
- ✅ Delays adaptativos para producción
- ✅ Reintentos de búsqueda de incidentes
- ✅ Selección automática de incidentes

**Prefijo**: `[MapExplorerPage]`

### 6. **Logs de Reporte** (`ReportIncident.jsx`)
- ✅ Validación de formularios
- ✅ Creación de incidentes
- ✅ Navegación post-creación
- ✅ Manejo de errores

**Prefijo**: `[ReportIncident]`

### 7. **Utilidades de Debug** (`debugUtils.js`)
- ✅ Información detallada de conexión
- ✅ Logging de operaciones DOM
- ✅ Delays adaptativos basados en conectividad
- ✅ Detección de conexiones lentas
- ✅ Monitoreo de Leaflet (si está disponible)

**Prefijo**: `[Debug]`

## 🔧 Cómo Usar los Logs

### Para el Usuario (Testing en Móvil):

1. **Abrir DevTools en el dispositivo móvil**:
   - Chrome Android: `chrome://inspect`
   - Safari iOS: Conectar a Safari en Mac

2. **Reproducir el error**:
   - Crear un nuevo incidente
   - Navegar al mapa
   - Hacer clic en marcadores

3. **Capturar logs**:
   - Copiar todos los logs de la consola
   - Especialmente buscar logs con `❌` (errores)
   - Prestar atención a logs con `[Global]` que contengan "insertBefore"

### Para el Desarrollador (Análisis):

#### Logs Críticos a Revisar:

1. **Errores DOM**:
   ```
   ❌ [Global] Error React/DOM interceptado
   ❌ [MapView] Error en ref del marcador
   ❌ [MapView] Error al abrir popup del marcador
   ```

2. **Problemas de Conectividad**:
   ```
   🌐 [Global] Cambio de conectividad
   📊 [Debug] Info de conexión
   ❌ [IncidentAPI] Error en getIncidents
   ```

3. **Problemas de Timing**:
   ```
   ⏱️ [Debug] Delay adaptativo calculado
   🎯 [MapExplorerPage] Procesando incidente recién creado
   ❌ [MapExplorerPage] No se pudo encontrar el incidente
   ```

4. **Operaciones DOM Fallidas**:
   ```
   🔧 [Debug] Operación DOM
   ❌ [MapInitializer] Error crítico en inicialización
   ⚠️ [MapView] Contenedor del mapa no está conectado al DOM
   ```

## 📊 Información Capturada

Cada log incluye información contextual relevante:

- **Timestamp**: Momento exacto del evento
- **Connection Type**: Tipo de conexión (2g, 3g, 4g, etc.)
- **Viewport**: Dimensiones de la pantalla
- **Memory Usage**: Uso de memoria (si está disponible)
- **DOM State**: Estado de conexión de elementos DOM
- **Stack Traces**: Para errores críticos

## 🎯 Patrones a Buscar

### Indicadores de Problema de Conectividad:
- `effectiveType: 'slow-2g'` o `'2g'`
- Tiempos de respuesta > 5000ms
- Múltiples reintentos de carga de incidentes

### Indicadores de Problema DOM:
- `isConnected: false` en elementos
- Errores durante `invalidateSize`
- Referencias de marcadores que se pierden

### Indicadores de Problema de Timing:
- Incidentes que no se encuentran después de múltiples intentos
- Errores durante la apertura de popups
- Fallos en la selección automática de incidentes

## 🚀 Próximos Pasos

Una vez que tengas los logs:

1. **Identifica el patrón**: ¿El error ocurre siempre en el mismo punto?
2. **Revisa la conectividad**: ¿Está relacionado con conexiones lentas?
3. **Verifica el timing**: ¿Los delays adaptativos son suficientes?
4. **Analiza el DOM**: ¿Los elementos se están desmontando inesperadamente?

Con esta información podremos implementar las correcciones específicas necesarias.
