import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'flowbite';

import { AuthProvider } from '@auth/services/AuthContext';
import { RouterProvider } from 'react-router-dom';
import router from './routes/AppRoute';
import { Toaster } from 'sonner';

// Logs globales para debugging en dispositivos móviles


// Capturar errores no manejados
window.addEventListener('error', (event) => {
  console.error('❌ [Global] Error no manejado:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error?.stack,
    timestamp: new Date().toISOString()
  });
});

// Capturar promesas rechazadas no manejadas
window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ [Global] Promesa rechazada no manejada:', {
    reason: event.reason,
    promise: event.promise,
    timestamp: new Date().toISOString()
  });
});

// Monitorear cambios de conectividad
if (navigator.connection) {
  navigator.connection.addEventListener('change', () => {
    console.log('🌐 [Global] Cambio de conectividad:', {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt,
      timestamp: new Date().toISOString()
    });
  });
}

// Logs de eventos de ventana relevantes
window.addEventListener('beforeunload', () => {
  console.log('🚪 [Global] Página descargándose...');
});

window.addEventListener('load', () => {
  console.log('✅ [Global] Página cargada completamente');
});

// Interceptar errores de React específicamente el error insertBefore
const originalConsoleError = console.error;
console.error = (...args) => {
  // Detectar específicamente el error insertBefore
  const message = args.join(' ');
  if (message.includes('insertBefore') || 
      message.includes('removeChild') || 
      message.includes('appendChild') ||
      message.includes('React') ||
      message.includes('Warning:')) {
    console.log('⚠️ [Global] Error React/DOM interceptado:', {
      args,
      stack: new Error().stack,
      timestamp: new Date().toISOString()
    });
  }
  originalConsoleError.apply(console, args);
};

// Verificar que el elemento root existe
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ [Global] Elemento root no encontrado!');
  throw new Error('Root element not found');
}



try {
  createRoot(rootElement).render(
    <StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster richColors visibleToasts={9} position="bottom-right" />
      </AuthProvider>
    </StrictMode>,
  );
  
} catch (error) {
  console.error('❌ [Global] Error montando aplicación React:', {
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
}
