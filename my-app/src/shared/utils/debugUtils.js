// Utilidades de debugging específicas para dispositivos móviles
// Especialmente para problemas de conectividad y manipulación DOM

export const logConnectionInfo = (context = '') => {
  const info = {
    context,
    connection: {
      effectiveType: navigator.connection?.effectiveType || 'unknown',
      downlink: navigator.connection?.downlink || 'unknown',
      rtt: navigator.connection?.rtt || 'unknown',
      saveData: navigator.connection?.saveData || false
    },
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      ratio: window.devicePixelRatio || 1
    },
    memory: {
      usedJSHeapSize: performance.memory?.usedJSHeapSize || 'unknown',
      totalJSHeapSize: performance.memory?.totalJSHeapSize || 'unknown'
    },
    timing: {
      loadEventEnd: performance.timing?.loadEventEnd || 0,
      navigationStart: performance.timing?.navigationStart || 0,
      loadTime: performance.timing ? (performance.timing.loadEventEnd - performance.timing.navigationStart) : 'unknown'
    },
    timestamp: new Date().toISOString()
  };
  
  console.log(`📊 [Debug] ${context} - Info de conexión:`, info);
  return info;
};

export const logDOMOperation = (operation, element, context = '') => {
  try {
    const info = {
      operation,
      context,
      element: {
        tagName: element?.tagName || 'unknown',
        id: element?.id || 'no-id',
        className: element?.className || 'no-class',
        parentNode: element?.parentNode?.tagName || 'no-parent',
        childNodes: element?.childNodes?.length || 0,
        isConnected: element?.isConnected || false
      },
      timestamp: new Date().toISOString()
    };
    
    console.log(`🔧 [Debug] Operación DOM - ${operation}:`, info);
    return info;
  } catch (error) {
    console.error('❌ [Debug] Error loggeando operación DOM:', {
      error: error.message,
      operation,
      context
    });
  }
};

export const wrapDOMMethod = (originalMethod, methodName, context = '') => {
  return function(...args) {
    try {
      console.log(`🎯 [Debug] ${context} - Ejecutando ${methodName}:`, {
        args: args.length,
        target: this?.tagName || 'unknown',
        timestamp: new Date().toISOString()
      });
      
      const result = originalMethod.apply(this, args);
      
      console.log(`✅ [Debug] ${context} - ${methodName} exitoso`);
      return result;
    } catch (error) {
      console.error(`❌ [Debug] ${context} - Error en ${methodName}:`, {
        error: error.message,
        stack: error.stack,
        args: args.length,
        target: this?.tagName || 'unknown',
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  };
};

export const monitorLeafletOperations = () => {
  // Interceptar operaciones críticas de Leaflet si están disponibles
  if (typeof window !== 'undefined' && window.L) {
    console.log('🗺️ [Debug] Monitoreando operaciones de Leaflet...');
    
    // Interceptar creación de marcadores
    const originalMarker = window.L.Marker;
    window.L.Marker = function(...args) {
      console.log('📍 [Debug] Creando marcador Leaflet:', {
        args: args.length,
        position: args[0],
        timestamp: new Date().toISOString()
      });
      
      try {
        const marker = new originalMarker(...args);
        console.log('✅ [Debug] Marcador Leaflet creado exitosamente');
        return marker;
      } catch (error) {
        console.error('❌ [Debug] Error creando marcador Leaflet:', {
          error: error.message,
          stack: error.stack,
          args: args.length
        });
        throw error;
      }
    };
    
    // Mantener el prototype
    window.L.Marker.prototype = originalMarker.prototype;
  }
};

export const logReactRenderCycle = (componentName, phase, additionalInfo = {}) => {
  console.log(`⚛️ [Debug] ${componentName} - ${phase}:`, {
    ...additionalInfo,
    timestamp: new Date().toISOString()
  });
};

export const createErrorBoundaryLogger = (componentName) => {
  return (error, errorInfo) => {
    console.error(`💥 [Debug] Error boundary activado en ${componentName}:`, {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });
  };
};

// Función para detectar si estamos en un dispositivo móvil con conexión lenta
export const isSlowMobileConnection = () => {
  const isMobile = window.innerWidth <= 768;
  const isSlowConnection = navigator.connection?.effectiveType === 'slow-2g' || 
                          navigator.connection?.effectiveType === '2g' ||
                          navigator.connection?.effectiveType === '3g';
  
  return isMobile && isSlowConnection;
};

// Función para agregar delays adaptativos basados en la conexión
export const getAdaptiveDelay = (baseDelay = 100) => {
  if (!navigator.connection) return baseDelay;
  
  const effectiveType = navigator.connection.effectiveType;
  const multipliers = {
    'slow-2g': 5,
    '2g': 3,
    '3g': 2,
    '4g': 1
  };
  
  const multiplier = multipliers[effectiveType] || 1;
  const adaptiveDelay = baseDelay * multiplier;
  
  console.log('⏱️ [Debug] Delay adaptativo calculado:', {
    baseDelay,
    effectiveType,
    multiplier,
    adaptiveDelay
  });
  
  return adaptiveDelay;
};
