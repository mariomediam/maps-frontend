import { useState, useEffect } from "react";

import MainHeader from "@/shared/components/MainHeader";
import AdminIncidentFilters from "@/features/admin/components/AdminIncidentFilters";
import AdminIncidentCard from "@/features/admin/components/AdminIncidentCard";
import useIncidentStateStore from "@features/incidentState/store/incidentStateStore";
import useIncidentCategoryStore from "@features/incidentCategory/store/incidentCategoryStore";
import useIncidentsStore from "@features/incident/store/incidentStore";
import ViewIncident from "@features/admin/components/ViewIncident";
import AdditionalInformation from "@features/admin/components/AdditionalInformation";

export const AdminIncident = () => {
  const { incidentStates, loadIncidentStates } = useIncidentStateStore();
  const { incidentCategories, loadIncidentCategories } =
    useIncidentCategoryStore();
  const searchIncidentsStored = useIncidentsStore(
    (state) => state.searchIncidentsStored
  );
  const incidentsStored = useIncidentsStore((state) => state.incidentsStored);
  const isLoadingSearchIncidents = useIncidentsStore(
    (state) => state.isLoading
  );
  const selectedIncident = useIncidentsStore((state) => state.selectedIncident);

  const [filters, setfilters] = useState({
    idState: "0",
    textSearch: "",
    idCategory: "0",
  });

  const [openModalViewIncident, setOpenModalViewIncident] = useState(false);
  const [openModalAdditionalInformation, setOpenModalAdditionalInformation] = useState(false);

  useEffect(() => {
    loadIncidentStates();
    loadIncidentCategories();
  }, [loadIncidentStates, loadIncidentCategories]);

  const handleChange = (e) => {
    setfilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let filtersToSend = { ...filters };

    if (Number.isInteger(Number(filtersToSend.textSearch))) {
      filtersToSend["idIncident"] = filtersToSend.textSearch;
      delete filtersToSend.textSearch;
    }

    if (filtersToSend.idState === "0") {
      delete filtersToSend.idState;
    }
    if (filtersToSend.idCategory === "0") {
      delete filtersToSend.idCategory;
    }
    searchIncidentsStored(filtersToSend);
  };

  if (isLoadingSearchIncidents) {
    return (
      <div className="h-dvh flex bg-secondary items-center justify-center gap-2">
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline w-8 h-8 text-gray-200 animate-spin fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
        <div className="text-lg">Buscando incidencias...</div>
      </div>
    );
  }

  return (
    <>
      <MainHeader />

      <div className="max-w-7xl mx-auto bg-secondary text-primary px-3">
        {/* {JSON.stringify(incidentsStored)} */}
        <h1 className="text-2xl text-primary mt-3 font-semibold">
          Incidencias registradas
        </h1>
        <AdminIncidentFilters
          filters={filters}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          incidentStates={incidentStates}
          incidentCategories={incidentCategories}
        />

        <p className="text-xs text-gray-500 mt-3">
          {incidentsStored.length} incidencias encontradas
        </p>
        {incidentsStored.map((incident) => (
          <AdminIncidentCard
            key={incident.id_incident}
            incident={incident}
            setOpenModalViewIncident={setOpenModalViewIncident}
            setOpenModalAdditionalInformation={setOpenModalAdditionalInformation}
          />
        ))}
      </div>
      <ViewIncident openModal={openModalViewIncident} setOpenModal={setOpenModalViewIncident} />
      {
        selectedIncident && (
          <AdditionalInformation openModal={openModalAdditionalInformation} setOpenModal={setOpenModalAdditionalInformation} />
        )
      }
      
    </>
  );
};

export default AdminIncident;
