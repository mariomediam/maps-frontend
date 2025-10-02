import IncidentCategorySelect from "@/features/incidentCategory/components/IncidentCategorySelect.jsx";
import IncidentStateSelect from "@/features/incidentState/components/IncidentStateSelect.jsx";

import IncidentCard from "@/features/incident/components/IncidentCard.jsx";
import useIncidentsStore from "@/features/incident/store/incidentStore.js";

const IncidentFilter = ({ className, onClose }) => {
  const isLoadingIncidents = useIncidentsStore((state) => state.isLoading);

  return (
    <div className={`bg-secondary md:border-r flex-auto overflow-y-auto`}>
      

      <div className="px-4 text-primary">
        

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
