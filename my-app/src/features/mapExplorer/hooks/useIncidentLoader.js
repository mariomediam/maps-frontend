import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useIncidentsStore from "@features/incident/store/incidentStore";

export const useIncidentLoader = ({incidentIdFromUrl}) => {
  const [searchParams] = useSearchParams();
  const searchIncidentsStored = useIncidentsStore((state) => state.searchIncidentsStored);
  const isLoading = useIncidentsStore((state) => state.isLoading);
  const error = useIncidentsStore((state) => state.error);
  const incidentsStored = useIncidentsStore((state) => state.incidentsStored);
  const setSelectedIncidentById = useIncidentsStore((state) => state.setSelectedIncidentById);
  

  useEffect(() => {
    const loadIncidents = async () => {
      try {
        const filters = {};
        const idCategory = searchParams.get("idCategory");
        const idState = searchParams.get("idState");

        if (idCategory) filters.idCategory = idCategory;
        if (idState) filters.idState = idState;

        console.log("**** 1 ******")

        await searchIncidentsStored(filters);
        // if (incidentIdFromUrl) {
        //   console.log("**** 2 ******")
        //   setSelectedIncidentById(incidentIdFromUrl);
        // }
        console.log("**** 3 ******")
      } catch (error) {
        console.error('❌ [MapExplorerPage] Error cargando incidentes:', {
          error: error.message,
          stack: error.stack,
          connectionType: navigator.connection?.effectiveType || 'unknown',
          timestamp: new Date().toISOString()
        });
      }
    };

    loadIncidents();
  }, [searchParams, searchIncidentsStored]);


  useEffect(() => {
    if (incidentIdFromUrl && incidentsStored.length > 0 && !isLoading) {
      console.log("🎯 [useIncidentLoader] Seleccionando incidente con ID:", incidentIdFromUrl);
      setSelectedIncidentById(incidentIdFromUrl);
    }
  }, [incidentIdFromUrl, incidentsStored, isLoading, setSelectedIncidentById]);




  return { isLoading, error };
};
