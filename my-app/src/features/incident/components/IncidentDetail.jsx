import useIncidentsStore from '@/features/incident/store/incidentStore.js';

export const IncidentDetail = ({ incident, className, onClose }) => {
  const closeIncidentDetail = useIncidentsStore((state) => state.closeIncidentDetail);

  const handleClose = () => {
    closeIncidentDetail();
    if (onClose) {
      onClose();
    }
  };

  if (!incident) {
    return null;
  }

  return (
    <div className={`${className} bg-white border-r p-4 overflow-y-auto`}>
      {/* Header con botón X */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Detalle del Incidente</h2>
        <button
          type="button"
          className="text-gray-500 hover:text-gray-700 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          onClick={handleClose}
          aria-label="Cerrar detalle"
        >
          ✕
        </button>
      </div>

      {/* Contenido del incidente */}
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-700 mb-1">ID del Incidente</h3>
          <p className="text-gray-600">{incident.id_incident}</p>
        </div>
        
        {incident.summary && (
          <div>
            <h3 className="font-medium text-gray-700 mb-1">Resumen</h3>
            <p className="text-gray-600">{incident.summary}</p>
          </div>
        )}

        {incident.description && (
          <div>
            <h3 className="font-medium text-gray-700 mb-1">Descripción</h3>
            <p className="text-gray-600">{incident.description}</p>
          </div>
        )}

        {incident.latitude && incident.longitude && (
          <div>
            <h3 className="font-medium text-gray-700 mb-1">Ubicación</h3>
            <p className="text-gray-600">
              Lat: {incident.latitude}, Lng: {incident.longitude}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
