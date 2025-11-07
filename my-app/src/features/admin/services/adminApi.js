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


export {
  getTradocByNumero,  
};
