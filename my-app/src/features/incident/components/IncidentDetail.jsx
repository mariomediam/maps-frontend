import useIncidentsStore from "@/features/incident/store/incidentStore.js";
import { useState, useEffect, memo } from "react";
import { getIncidentPhotographyById } from "@/features/incident/services/incidentApi.js";
import IncidentPthotographyCarousel from "@/features/incident/components/IncidentPthotographyCarousel.jsx";
import { format } from "@formkit/tempo";

const FONT_STATE_COLOR = {
  "#FFC107": "text-primary",
  "#C82333": "text-secondary",
  "#218838": "text-primary",
};

export const IncidentDetail = ({
  isMobile,
  setSelectedIncident,
  setExpandMap,
  incident,
}) => {
  const [photographsWithUrl, setPhotographsWithUrl] = useState([]);
  const [isLoadingPhotographs, setIsLoadingPhotographs] = useState(false);

  // Extraer datos del incidente de forma segura
  const {
    category_name = "",
    summary = "",
    description = "",
    latitude = "",
    longitude = "",
    description_state = "",
    color_state = "",
    photographs = [],
    id_incident = 0,
    inspector_username = "",
    registration_date = "",
  } = incident || {};

  const onClickCloseButton = () => {
    setExpandMap(false);
    setSelectedIncident(null);
  };

  useEffect(() => {
    let cancelled = false;

    const fetchPhotographs = async () => {
      // Si no hay incidente o fotografías, limpiar estado
      if (!incident?.id_incident || !photographs?.length) {
        setPhotographsWithUrl([]);
        setIsLoadingPhotographs(false);
        return;
      }

      try {
        setIsLoadingPhotographs(true);

        // Descarga en paralelo (más rápido y un solo setState después)
        const ids = photographs.map((p) => p.id_photography);
        const results = await Promise.all(
          ids.map((id) => getIncidentPhotographyById(id))
        );

        // Construir URLs para las fotografías si no las tienen
        const photographsWithUrls = results.map((photo) => {
          if (photo.url) {
            return photo; // Ya tiene URL
          }

          // Construir URL usando r2_key si no tiene URL
          if (photo.r2_key) {
            const baseUrl =
              import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
            return {
              ...photo,
              url: `${baseUrl}/images/${photo.r2_key}`,
            };
          }

          return photo;
        });

        if (!cancelled) {
          setPhotographsWithUrl(photographsWithUrls);
        }
      } catch (err) {
        if (!cancelled)
          console.error("Error fetching photographs with url:", err);
      } finally {
        if (!cancelled) setIsLoadingPhotographs(false);
      }
    };

    fetchPhotographs();

    return () => {
      cancelled = true;
    };
    // Dependencias más específicas para evitar re-ejecuciones innecesarias
  }, [incident?.id_incident, photographs?.length]);

  const classPillState = `${FONT_STATE_COLOR[color_state]} text-xs font-medium me-2 px-2.5 py-0.5 rounded-full ms-2`;

  const handleClose = () => {
    closeIncidentDetail();
    if (onClose) {
      onClose();
    }
  };

  // Return temprano después de todos los hooks
  if (!incident) {
    return <></>;
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex justify-between m-3 ">
        <div>
          <h4 className="text-base/5 font-semibold text-primary">
            {category_name}
            <span
              className={classPillState}
              style={{ backgroundColor: color_state }}
            >
              {description_state}
            </span>
          </h4>
          <p className="text-sm">
            {" "}
            <span className="text-gray-500">id:</span> {incident.id_incident}
          </p>
        </div>

        {/* {isMobile && ( */}
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 my-0 "
            onClick={onClickCloseButton}
            aria-label="Cerrar detalle"
          >
            ✕
          </button>
        {/* )} */}
      </div>
      {/* Title */}

      <div className="mx-3 mt-0 mb-3">
        {/* Registrado por */}
        <p className="text-sm text-gray-500 mt-3">Registrado por</p>
        <p className="">
          {inspector_username.toUpperCase()} el{" "}
          {format(registration_date, "DD/MM/YYYY HH:mm")}
        </p>

        {/* Resumen del problema */}
        <p className="text-sm text-gray-500 mt-3">Resumen del problema</p>
        <p className="">{summary}</p>

        {/* Referencia del incidente */}
        {incident.reference && (
          <>
            <p className="text-sm text-gray-500 mt-3">
              Referencia de la incidencia
            </p>
            <p className="">{incident.reference}</p>
          </>
        )}

        {!isLoadingPhotographs &&
        photographsWithUrl.length > 0 &&
        photographsWithUrl[0].hasOwnProperty("url") ? (
          <>
            {photographsWithUrl.length > 0 && (
              <>
                <p className="text-sm mt-3 text-gray-500">Fotografías</p>
                <IncidentPthotographyCarousel
                  photographs={photographsWithUrl}
                />
              </>
            )}
          </>
        ) : (
          <div className="flex justify-start items-center mt-3">
            <p className="text-gray-500 me-2 text-sm">Fotografías</p>
            {
              photographs.length > 0 ? (
                <div className="animate-spin rounded-full h-2 w-2 border-b-1 border-primary"></div>
              ) : (
                <small className="text-primary me-2 text-xs">Ninguna</small>
              )
            }
            
          </div>
        )}
        
      </div>

      
    </div>
  );
};
