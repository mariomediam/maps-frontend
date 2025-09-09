import useAxios from '@utils/useAxios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const URL = `${API_BASE_URL}/states`;

const getIncidentStates = async () => {
	try {
		const api = useAxios();

		const {
			data: { content },
		} = await api.get(URL);

		return content;
	} catch (error) {
		console.error('Error fetching states:', error);
		throw error;
	}
};

export { getIncidentStates };
