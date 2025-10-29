import useAxios from "@utils/useAxios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const URL = `${API_BASE_URL}/incidents`;

const getIncidents = async (filters = {}) => {
  const { idCategory, idState, showOnMap, textSearch, idIncident } = filters;

  try {
    const api = useAxios();

    // Construir parámetros de consulta correctamente
    const queryParams = new URLSearchParams();



    if (idCategory) {
      queryParams.append("id_category", idCategory);
    }
    if (idState) {
      queryParams.append("id_state", idState);
    }
    if (showOnMap) {
      queryParams.append("show_on_map", showOnMap);
    }
    if (textSearch) {
      queryParams.append("text_search", textSearch);
    }
    if (idIncident) {
      queryParams.append("id_incident", idIncident);
    }

    const queryString = queryParams.toString();
    const URLIncidents = queryString ? `${URL}?${queryString}` : URL;

    const {
      data: { content },
    } = await api.get(URLIncidents);

    return content;
  } catch (error) {
    console.error("❌ [IncidentAPI] Error en getIncidents:", {
      error: error.message,
      stack: error.stack,
      filters,
      connectionType: navigator.connection?.effectiveType || "unknown",
      response: error.response?.data,
      status: error.response?.status,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
};

const getIncidentPhotographyById = async (idPhotography) => {
  try {
    const api = useAxios();

    const {
      data: { content },
    } = await api.get(`${URL}/photography/${idPhotography}`);
    return content;
  } catch (error) {
    console.error(`Error fetching photography ${idPhotography}:`, error);
    throw error;
  }
};

// curl --location 'http://127.0.0.1:8000/incidents/35'

const getIncidentById = async (idIncident) => {
  try {
    const api = useAxios();
    const {
      data: { content },
    } = await api.get(`${URL}/${idIncident}`);
    return content;
  } catch (error) {
    throw error;
  }
};


// --header 'Content-Type: application/json' \
// --header 'Authorization: ••••••' \
// --data '{
//   "show_on_map": true
// }'

const updateIncident = async (idIncident, incidentData) => {
  try {
    const api = useAxios();
    const { data: { content } } = await api.patch(`${URL}/${idIncident}/`, incidentData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return content;
  } catch (error) {
    throw error;
  }
};



// Función para crear un nuevo incidente con archivos
const createIncident = async (incidentData) => {
  console.log("🎆 [IncidentAPI] Creando nuevo incidente:", {
    incidentData: {
      category_id: incidentData.category_id,
      latitude: incidentData.latitude,
      longitude: incidentData.longitude,
      summary: incidentData.summary,
      reference: incidentData.reference,
      filesCount: incidentData.files?.length || 0,
    },
    connectionType: navigator.connection?.effectiveType || "unknown",
    timestamp: new Date().toISOString(),
  });

  try {
    const api = useAxios();

    // Crear FormData para enviar archivos
    const formData = new FormData();

    // Agregar campos de texto
    formData.append("category_id", incidentData.category_id);
    formData.append("latitude", incidentData.latitude);
    formData.append("longitude", incidentData.longitude);

    if (incidentData.summary) {
      formData.append("summary", incidentData.summary);
    }

    if (incidentData.reference) {
      formData.append("reference", incidentData.reference);
    }

    // Agregar archivos (si existen)
    if (incidentData.files && incidentData.files.length > 0) {
      incidentData.files.forEach((file, index) => {
        console.log(`📄 [IncidentAPI] Añadiendo archivo ${index + 1}:`, {
          name: file.name,
          size: file.size,
          type: file.type,
        });
        formData.append("files", file);
      });
    }

    console.log("📤 [IncidentAPI] Enviando petición POST...");
    const startTime = Date.now();

    const {
      data: { content },
    } = await api.post(`${URL}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000, // 30 segundos de timeout para conexiones lentas
    });

    const endTime = Date.now();

    console.log("✅ [IncidentAPI] Incidente creado exitosamente:", {
      id: content.id_incident,
      summary: content.summary,
      duration: `${endTime - startTime}ms`,
      timestamp: new Date().toISOString(),
    });

    return content;
  } catch (error) {
    console.error("❌ [IncidentAPI] Error creando incidente:", {
      error: error.message,
      stack: error.stack,
      incidentData: {
        category_id: incidentData.category_id,
        latitude: incidentData.latitude,
        longitude: incidentData.longitude,
        summary: incidentData.summary,
        reference: incidentData.reference,
        filesCount: incidentData.files?.length || 0,
      },
      connectionType: navigator.connection?.effectiveType || "unknown",
      response: error.response?.data,
      status: error.response?.status,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
};


const getIncidentMiniatureById = async (idIncident) => {
  try {
    const api = useAxios();
    const { data: { content } } = await api.get(`${URL}/miniature/${idIncident}`);
    return content;
  } catch (error) {
    throw error;
  }
};

// getIncidentPhotographyBlobById no me retorna un json sino un blob
const getIncidentPhotographyBlobById = async (idPhotography) => {
  try {
    const api = useAxios();
    const { data } = await api.get(`${URL}/photography/blob/${idPhotography}`, {
      responseType: 'blob', // Importante: indicar que esperamos un blob
    });
    return data; // Retornar directamente el blob
  } catch (error) {
    console.error(`❌ [IncidentAPI] Error obteniendo blob de fotografía ${idPhotography}:`, error);
    throw error;
  }
};


export {
  getIncidents,
  getIncidentPhotographyById,
  getIncidentById,
  createIncident,
  getIncidentMiniatureById,
  updateIncident,
  getIncidentPhotographyBlobById,
};
