import useAxios from '@utils/useAxios';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const URL = `${API_BASE_URL}/categories`;

const getIncidentCategories = async (params = {}) => {

	const { isActive } = params;

	try {
		const api = useAxios();

		const queryParams = new URLSearchParams();

		if (isActive) {
			queryParams.append('is_active', isActive);
		}

		const queryString = queryParams.toString();
		const URLCategories = queryString ? `${URL}?${queryString}` : URL;

		const {
			data: { content },
		} = await api.get(URLCategories);

		return content;
	} catch (error) {
		console.error('Error fetching categories:', error);
		throw error;
	}
};

export { getIncidentCategories };
