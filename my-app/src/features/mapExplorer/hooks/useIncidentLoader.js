import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useIncidentsStore from "@features/incident/store/incidentStore";

export const useIncidentLoader = () => {
  const [searchParams] = useSearchParams();
  const searchIncidentsStored = useIncidentsStore((state) => state.searchIncidentsStored);
  const isLoading = useIncidentsStore((state) => state.isLoading);
  const error = useIncidentsStore((state) => state.error);

  useEffect(() => {
    const loadIncidents = async () => {
      try {
        const filters = {};
        const idCategory = searchParams.get("idCategory");
        const idState = searchParams.get("idState");

        if (idCategory) filters.idCategory = idCategory;
        if (idState) filters.idState = idState;

        await searchIncidentsStored(filters);
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

  return { isLoading, error };
};
