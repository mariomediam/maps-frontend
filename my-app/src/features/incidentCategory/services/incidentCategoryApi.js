import useAxios from "@utils/useAxios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const URL = `${API_BASE_URL}/categories`;

const getIncidentCategories = async () => {
  try {
    let api = useAxios();

    let URLIncidentCategories = `${URL}`;    

    let {
      data: { content },
    } = await api.get(URLIncidentCategories);

    return content;
  } catch (error) {
    throw error;
  }
};

export { getIncidentCategories };