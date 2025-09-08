
import useIncidentsStore from "@/features/incident/store/incidentStore.js";
import IncidentPhotography from "@/features/incident/components/IncidentPhotography";
import { format } from "@formkit/tempo";

const IncidentDetail = ({ className, onClose }) => {
  const selectedIncident = useIncidentsStore((state) => state.selectedIncident);
  const clearSelectedIncident = useIncidentsStore((state) => state.clearSelectedIncident);

  if (!selectedIncident) {
    return null;
  }

  const {
    summary,
    description,
    registration_date,
    category_name,
    state_name,
    photographs,
    latitude,
    longitude,
    address
  } = selectedIncident;

  const handleClose = () => {
    clearSelectedIncident();
    if (onClose) onClose();
  };

  return (
    <div className={`p-4 bg-white border-r md:border-r border-t md:border-t-0 ${className} overflow-y-auto`}>
      {/* Header con botón de cerrar */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Detalle del Incidente</h2>
        <button
          type="button"
          className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          onClick={handleClose}
        >
          ✕
        </button>
      </div>

      {/* Contenido del incidente */}
      <div className="space-y-4">
        {/* Resumen */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-1">Resumen</h3>
          <p className="text-sm text-gray-900">{summary}</p>
        </div>

        {/* Descripción */}
        {description && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Descripción</h3>
            <p className="text-sm text-gray-900">{description}</p>
          </div>
        )}

        {/* Información básica */}
        <div className="grid grid-cols-1 gap-3">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Fecha de registro</h3>
            <p className="text-sm text-gray-900">
              {format(registration_date, "DD/MM/YYYY HH:mm")}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Categoría</h3>
            <p className="text-sm text-gray-900">{category_name}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Estado</h3>
            <p className="text-sm text-gray-900">{state_name}</p>
          </div>

          {address && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Dirección</h3>
              <p className="text-sm text-gray-900">{address}</p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Coordenadas</h3>
            <p className="text-sm text-gray-900">
              Lat: {latitude}, Lng: {longitude}
            </p>
          </div>
        </div>

        {/* Fotografías */}
        {photographs && photographs.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Fotografías</h3>
            <div className="grid grid-cols-1 gap-2">
              {photographs.map((photo) => (
                <div key={photo.id_photography} className="flex justify-center">
                  <IncidentPhotography 
                    idPhotography={photo.id_photography}
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentDetail;