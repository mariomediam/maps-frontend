import IncidentCategorySelect from "@/features/incidentCategory/components/IncidentCategorySelect.jsx";
import IncidentStateSelect from "@/features/incidentState/components/IncidentStateSelect.jsx";

import IncidentCard from "@/features/incident/components/IncidentCard.jsx";

const MapSidebar = ({ className, onClose }) => {
  return (
    <div className={`p-3 bg-white border-r ${className} overflow-y-auto`}>
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
        <IncidentCategorySelect className="mt-4" />

        <div className="mt-3 flex justify-center">
          <IncidentCard />
        </div>
      </div>
    </div>
  );
};
export default MapSidebar;
