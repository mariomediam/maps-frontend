import useAxios from "@utils/useAxios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const URL = `${API_BASE_URL}/categories`;

const getIncidentCategories = async () => {
	try {
		const api = useAxios();

		const {
			data: { content },
		} = await api.get(URL);

		return content;
	} catch (error) {
		console.error("Error fetching categories:", error);
		throw error;
	}
};

export { getIncidentCategories };
