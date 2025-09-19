import React, { useRef, useState, useEffect } from "react";

export default function LoadPhotography() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const fileInputRef = useRef(null);

  const MAX_MB = 10;                // cambia el límite si necesitas
  const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

  // Detectar si es móvil
  useEffect(() => {
    const checkIsMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
      return mobileKeywords.some(keyword => userAgent.includes(keyword)) || 
             window.innerWidth <= 768;
    };
    
    setIsMobile(checkIsMobile());
    
    const handleResize = () => setIsMobile(checkIsMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function openFileDialog() {
    fileInputRef.current?.click();
  }

  function removeFile(indexToRemove) {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  }

  function reset() {
    setFiles([]);
    setError(null);
  }

  function handleFiles(fileList) {
    setError(null);
    const newFiles = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      
      // Validaciones básicas
      if (!ACCEPTED.includes(file.type) && !file.type.startsWith("image/")) {
        setError(`Archivo "${file.name}" no soportado. Sube una imagen (JPG, PNG, WEBP, HEIC).`);
        continue;
      }
      
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > MAX_MB) {
        setError(`La imagen "${file.name}" supera ${MAX_MB} MB (${sizeMB.toFixed(1)} MB).`);
        continue;
      }

      const fileData = {
        id: Date.now() + i, // ID único simple
        name: file.name || `photo-${i}`,
        type: file.type || "image/*",
        sizeMB: sizeMB.toFixed(2),
        lastModified: file.lastModified,
        previewUrl: URL.createObjectURL(file),
        file: file
      };
      
      newFiles.push(fileData);
    }
    
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  }

  function handleChange(e) {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      handleFiles(fileList);
    }
  }

  // Drag and drop handlers para desktop
  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const fileList = e.dataTransfer.files;
    if (fileList && fileList.length > 0) {
      handleFiles(fileList);
    }
  }

  return (
    <div className="max-w-4xl mx-auto my-8 p-4 border border-gray-200 rounded-xl">
      <h2 className="mb-3 text-xl font-semibold">Fotos (opcional)</h2>

      {/* Interfaz adaptativa según dispositivo */}
      {isMobile ? (
        // Vista móvil
        <div className="mb-4">
          <button 
            onClick={openFileDialog} 
            className="w-full px-4 py-3 bg-blue-600 text-white border-none rounded-lg cursor-pointer font-semibold hover:bg-blue-700 transition-colors"
          >
            Tomar foto o seleccionar una existente
          </button>
        </div>
      ) : (
        // Vista desktop con drag and drop
        <div 
          className="mb-4 border-2 border-dashed border-yellow-400 bg-yellow-50 rounded-lg p-8 cursor-pointer hover:bg-yellow-100 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          {/* Área de carga inicial o botón para agregar más fotos */}
          <div className="text-center mb-4">
            <p className="text-gray-700 mb-4">
              {files.length === 0 ? 'Arrastra tus fotos aquí o ' : 'Arrastra más fotos aquí o '}
              <span className="inline-block px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors">
                {files.length === 0 ? 'Explora en tu equipo' : 'Agregar más fotos'}
              </span>
            </p>
          </div>

          {/* Previsualización de fotos dentro del área de drag and drop */}
          {files.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-left">Fotos seleccionadas ({files.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {files.map((fileData, index) => (
                  <div key={fileData.id} className="relative group">
                    <img
                      src={fileData.previewUrl}
                      alt={`Vista previa ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      loading="lazy"
                    />
                    {/* Botón para eliminar foto individual */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                      title="Eliminar foto"
                    >
                      ×
                    </button>
                    {/* Información del archivo */}
                    <div className="mt-1 text-xs text-gray-600 truncate">
                      <div className="font-medium">{fileData.name}</div>
                      <div>{fileData.sizeMB} MB</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input de archivos oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="hidden"
      />

      {/* Botón para resetear si hay fotos */}
      {files.length > 0 && (
        <div className="mb-4">
          <button 
            onClick={reset} 
            className="px-4 py-2 bg-red-600 text-white border-none rounded-lg cursor-pointer font-semibold hover:bg-red-700 transition-colors"
          >
            Quitar todas las fotos
          </button>
        </div>
      )}

      {error && <p className="text-red-700 mt-2 mb-4">{error}</p>}

      {/* Para móvil, mostrar previsualización por separado */}
      {isMobile && files.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-3">Fotos seleccionadas ({files.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((fileData, index) => (
              <div key={fileData.id} className="relative group">
                <img
                  src={fileData.previewUrl}
                  alt={`Vista previa ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  loading="lazy"
                />
                {/* Botón para eliminar foto individual */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                  title="Eliminar foto"
                >
                  ×
                </button>
                {/* Información del archivo */}
                <div className="mt-1 text-xs text-gray-600 truncate">
                  <div className="font-medium">{fileData.name}</div>
                  <div>{fileData.sizeMB} MB</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Consejos */}
      <div className="mt-4 text-sm text-gray-600">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-green-600 font-bold">✓</span>
          <span>Los reportes con fotos tienden a resolverse más rápidamente</span>
        </div>
        <div className="flex items-start gap-2 mb-2">
          <span className="text-green-600 font-bold">✓</span>
          <span>Para mejores resultados incluye una toma cercana y una amplia</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-red-600 font-bold">×</span>
          <span>Evita información personal y placas de vehículos</span>
        </div>
      </div>
    </div>
  );
}

