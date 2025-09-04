import useAxios from "@utils/useAxios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const URL = `${API_BASE_URL}/states`;

const getIncidentStates = async () => {
  try {
    
    let api = useAxios();

    let URLIncidentStates = `${URL}`;    

    let {
      data: { content },
    } = await api.get(URLIncidentStates);

    return content;
  } catch (error) {
    throw error;
  }
};

export { getIncidentStates };