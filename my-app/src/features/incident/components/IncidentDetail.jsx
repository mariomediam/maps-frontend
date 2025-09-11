import useIncidentsStore from "@/features/incident/store/incidentStore.js";
import { useState, useEffect } from "react";
import { getIncidentPhotographyById } from "@/features/incident/services/incidentApi.js";
import IncidentPthotographyCarousel from "@/features/incident/components/IncidentPthotographyCarousel.jsx";

const FONT_STATE_COLOR = {
  "#FFC107": "text-primary",
  "#C82333": "text-secondary",
  "#218838": "text-primary",
};

// {
//   "id_incident": 35,
//   "registration_date": "2025-09-04T10:59:44.106175-05:00",
//   "category": 1,
//   "category_name": "Siniestros (accidentes) de tránsito",
//   "latitude": "-5.18225810",
//   "longitude": "-80.63713050",
//   "summary": "Choque entre un auto y una mototaxi en plena esquina; los vehículos bloquean el cruce y hay restos de vidrio sobre la pista",
//   "reference": "Al lado de Inkafarma",
//   "show_on_map": true,
//   "user_type": "inspector",
//   "is_closed": false,
//   "inspector": 1,
//   "inspector_username": "mmedina",
//   "citizen_name": null,
//   "citizen_lastname": null,
//   "citizen_phone": null,
//   "citizen_email": null,
//   "priority": null,
//   "derivation_document": null,
//   "closure_type": null,
//   "closure_description": null,
//   "closure_date": null,
//   "closure_user": null,
//   "photographs": [
//       {
//           "id_photography": 29,
//           "name": "foto1.jpg",
//           "content_type": "image/jpeg",
//           "file_size": 430452,
//           "r2_key": "incidents/35/20250904_155945",
//           "upload_date": "2025-09-04T10:59:47.581912-05:00"
//       },
//       {
//           "id_photography": 30,
//           "name": "foto2.jpg",
//           "content_type": "image/jpeg",
//           "file_size": 595630,
//           "r2_key": "incidents/35/20250904_155947",
//           "upload_date": "2025-09-04T10:59:49.953008-05:00"
//       }
//   ],
//   "id_state": 1,
//   "description_state": "Presentado",
//   "color_state": "#C82333"
// }

export const IncidentDetail = ({ incident, className, onClose }) => {
  const closeIncidentDetail = useIncidentsStore(
    (state) => state.closeIncidentDetail
  );

  if (!incident) {
    return <></>;
  }

  const {
    category_name = "",
    summary,
    description,
    latitude,
    longitude,
    description_state,
    color_state,
    photographs = [],
    id_incident = 0,
  } = incident;

  const [photographsWithUrl, setPhotographsWithUrl] = useState(photographs);
  const [isLoadingPhotographs, setIsLoadingPhotographs] = useState(false);

  // useEffect(() => {
  //   try {
  //     setIsLoadingPhotographs(true);
  //     const fetchPhotographsWithUrl = async () => {
      

  //       const photographsWithUrl = [];
  //       for (const photograph of photographs) {
  //         const photographWithUrl = await getIncidentPhotographyById(
  //           photograph.id_photography
  //         );
  //         photographsWithUrl.push(photographWithUrl);
  //       }
  //       console.log("******** 2 **************");
  //       setPhotographsWithUrl(photographsWithUrl);
  //     };
  //     console.log("******** 1 **************");
  //     fetchPhotographsWithUrl();
  //     console.log("******** 3 **************");
  //   } catch (error) {
  //     console.error("Error fetching photographs with url:", error);
  //   } finally {
  //     setIsLoadingPhotographs(false);
  //     console.log("******** 4 **************");
  //   }

    
  // }, [photographs]);

  useEffect(() => {
    let cancelled = false;
  
    (async () => {
      try {
        setIsLoadingPhotographs(true);
  
        // Descarga en paralelo (más rápido y un solo setState después)
        const ids = (photographs ?? []).map(p => p.id_photography);
        const results = await Promise.all(ids.map(id => getIncidentPhotographyById(id)));
  
        if (!cancelled) {
          setPhotographsWithUrl(results);
        }
      } catch (err) {
        if (!cancelled) console.error("Error fetching photographs with url:", err);
      } finally {
        if (!cancelled) setIsLoadingPhotographs(false);
      }
    })();
  
    return () => { cancelled = true; };
    // Dependencia estable para no re-ejecutar por referencias nuevas:
  }, [id_incident]);

  const classPillState = `bg-[${color_state}] ${FONT_STATE_COLOR[color_state]} text-xs font-medium me-2 px-2.5 py-0.5 rounded-full ms-2`;

  const handleClose = () => {
    closeIncidentDetail();
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className={`${className} bg-white border-r pt-0 pb-4 px-4 overflow-y-auto`}
    >
      {/* Header con botón X */}
      <div className="flex items-center justify-end my-0">
        <button
          type="button"
          className="text-gray-500 hover:text-gray-700 text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 my-0"
          onClick={handleClose}
          aria-label="Cerrar detalle"
        >
          ✕
        </button>
      </div>

      {/* Title */}
      <h4 className="text-base/5 font-semibold text-primary">
        {category_name}
        <span className={classPillState}>{description_state}</span>
      </h4>
      <p className="text-sm">
        {" "}
        <span className="text-gray-500">id:</span> {incident.id_incident}
      </p>

      {/* Resumen del problema */}
      <p className="text-sm text-gray-500 mt-3">Resumen del problema</p>
      <p className="">{summary}</p>

      {/* {JSON.stringify(photographsWithUrl)} */}

      {/* Referencia del incidente */}
      {incident.reference && (
        <>
          <p className="text-sm text-gray-500 mt-3">Referencia del incidente</p>
          <p className="">{incident.reference}</p>
        </>
      )}

      {!isLoadingPhotographs && photographsWithUrl.length > 0 && photographsWithUrl[0].hasOwnProperty('url') ? (
        <IncidentPthotographyCarousel photographs={photographsWithUrl} />
        
      ) : (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-2 w-2 border-b-1 border-primary"></div>
        </div>
      )}

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
