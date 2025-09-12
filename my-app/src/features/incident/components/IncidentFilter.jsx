import IncidentCategorySelect from "@/features/incidentCategory/components/IncidentCategorySelect.jsx";
import IncidentStateSelect from "@/features/incidentState/components/IncidentStateSelect.jsx";

import IncidentCard from "@/features/incident/components/IncidentCard.jsx";
import useIncidentsStore from "@/features/incident/store/incidentStore.js";

const IncidentFilter = ({ className, onClose }) => {
  const isLoadingIncidents = useIncidentsStore((state) => state.isLoading);

  return (
    <div className={`p-3 bg-secondary border-r ${className} overflow-y-auto`}>
      {/* Header con botón de cerrar - Solo visible en móvil */}
      <div className="flex items-center justify-between mb-4 md:hidden">
        <h2 className="text-lg font-semibold text-gray-800">Filtros</h2>
        <button
          type="button"
          className="text-gray-500 hover:text-gray-700 text-xl"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      {/* Título para desktop */}
      <div className="px-4">
        <h2 className="hidden md:block text-lg font-semibold text-gray-800 mb-4">
          Filtros
        </h2>

        {/* Filtros */}
        <IncidentStateSelect />
        <IncidentCategorySelect className="mt-4 mb-4" />

        <label
          htmlFor="incident_state_select"
          className="text-[12px] text-gray-500 mt-3 text-start"
        >
          Últimos incidentes registrados
          {isLoadingIncidents && (
            <div className="mt-2 flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-2 w-2 border-b-1 border-primary"></div>
            </div>
          )}
        </label>
        <div className="flex justify-center">
          <IncidentCard />
        </div>
      </div>
    </div>
  );
};

export default IncidentFilter;
