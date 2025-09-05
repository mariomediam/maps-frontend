import useAxios from "@utils/useAxios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const URL = `${API_BASE_URL}/incidents`;

const getIncidents = async (filters = {}) => {
  const { idCategory, idState, showOnMap } = filters;

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

    const queryString = queryParams.toString();
    const URLIncidents = queryString ? `${URL}?${queryString}` : URL;

    console.log("Fetching incidents from:", URLIncidents); // Para debug

    const {
      data: { content },
    } = await api.get(URLIncidents);

    return content;
  } catch (error) {
    throw error;
  }
};



// curl --location 'http://127.0.0.1:8000/    photography/32'

const getIncidentPhotographyById = async (idPhotography) => {
  try {
    const api = useAxios();

    const { data: { content }, } = await api.get(`${URL}/photography/${idPhotography}`);
    return content;
  } catch (error) {
    throw error;
  }
};



export { getIncidents, getIncidentPhotographyById };
