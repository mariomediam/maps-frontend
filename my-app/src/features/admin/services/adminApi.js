import useAxios from "@utils/useAxios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const URL = `${API_BASE_URL}/tradoc`;

const getTradocByNumero = async (params = {}) => {
  const { depend, numero } = params;
  
  try {
    const api = useAxios();
    const {
      data: { content },
    } = await api.get(`${URL}?opcion=NUMERO&depend=${depend}&numero=${numero}`);
    return content;
  } catch (error) {
    throw error;
  }
};

const getTradocByC_Docum = async (params = {}) => {
  const { c_docum } = params;
  try {
    const api = useAxios();
    const { data: { content } } = await api.get(`${URL}?opcion=C_DOCUM&c_docum=${c_docum}`);
    if (content.length > 0) {
      return content[0];
    }
    return content;
  } catch (error) {
    throw error;
  }
};

const getPathByC_Docum = async (params = {}) => {
  const { c_docum } = params;
  try {
    const api = useAxios();
    const { data: { content } } = await api.get(`${URL}/path?c_docum=${c_docum}`);
    return content;
  } catch (error) {
    throw error;
  }
};

export {
  getTradocByNumero,  
  getTradocByC_Docum,
  getPathByC_Docum,
};
