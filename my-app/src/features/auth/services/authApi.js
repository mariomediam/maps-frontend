import useAxios from '@utils/useAxios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const URL = `${API_BASE_URL}/api/token/`;


const login = async (username, password) => {
	try {
		const api = useAxios();
		const response = await api.post(URL, { username, password });
		console.log(response.data);
		return response.data;
	} catch (error) {
		console.error('Error al iniciar sesión:', error);
		throw error;
	}
};

export { login };