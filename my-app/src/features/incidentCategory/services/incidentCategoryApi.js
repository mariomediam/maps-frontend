import useAxios from '@utils/useAxios';
import incidentCategoryData from '@features/incidentCategory/data/incidentCategoryData';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const URL = `${API_BASE_URL}/categories`;

// const getIncidentCategories = async (params = {}) => {

// 	const { isActive } = params;

// 	try {
// 		const api = useAxios();

// 		const queryParams = new URLSearchParams();

// 		if (isActive) {
// 			queryParams.append('is_active', isActive);
// 		}

// 		const queryString = queryParams.toString();
// 		const URLCategories = queryString ? `${URL}?${queryString}` : URL;

// 		const {
// 			data: { content },
// 		} = await api.get(URLCategories);

// 		return content;
// 	} catch (error) {
// 		console.error('Error fetching categories:', error);
// 		throw error;
// 	}
// };

const getIncidentCategories = async (params = {}) => {

	const { isActive } = params;

	try {
		
		if (isActive) {
			return incidentCategoryData.filter((category) => category.is_active === isActive)
		}

		return incidentCategoryData;
	} catch (error) {
		console.error('Error fetching categories:', error);
		throw error;
	}
};

export { getIncidentCategories };
