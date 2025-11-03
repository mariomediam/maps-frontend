import { useEffect, useState } from "react";
import CameraIcon from "@shared/assets/icons/CameraIcon";
import IncidentCard from "@features/incident/components/IncidentCard";
import useIncidentsStore from "@features/incident/store/incidentStore";
import ViewIncident from "@features/admin/components/ViewIncident";

const RecentActivity = () => {
  const searchIncidentsStored = useIncidentsStore(
    (state) => state.searchIncidentsStored
  );
  const isLoadingIncidents = useIncidentsStore((state) => state.isLoading);
  const [openModalViewIncident, setOpenModalViewIncident] = useState(false);

  useEffect(() => {
    searchIncidentsStored({
      showOnMap: "True",
    });
  }, []);

  return (
    <>
      <article className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm ">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-primary flex items-center">
          <CameraIcon className="me-1" /> Actividad reciente
        </h5>

        {
          isLoadingIncidents ? (
            <div className="flex items-center h-full"> <p className="text-xs text-gray-500">
              Cargando actividades recientes 
              </p>
					<div className="animate-spin ms-2 rounded-full h-2 w-2 border-b-1 border-primary"></div>
				</div>
          ) : (
            <>
              <IncidentCard showModalIncident={setOpenModalViewIncident} />
            </>
          )
        }
      </article>
      <ViewIncident
        openModal={openModalViewIncident}
        setOpenModal={setOpenModalViewIncident}
      />
    </>
  );
};

export default RecentActivity;
