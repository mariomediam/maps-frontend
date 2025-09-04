import useAxios from "@utils/useAxios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const URL = `${API_BASE_URL}/incidents`;

const getIncidents = async (filters = {}) => {
	const { idCategory, idState, showOnMap } = filters;

	try {
		const api = useAxios();

		let URLIncidents = `${URL}`;

		if (idCategory) {
			URLIncidents += `?id_category=${idCategory}`;
		}
		if (idState) {
			URLIncidents += `?id_state=${idState}`;
		}
		if (showOnMap) {
			URLIncidents += `?show_on_map=${showOnMap}`;
		}

		const {
			data: { content },
		} = await api.get(URLIncidents);

		return content;
	} catch (error) {
		throw error;
	}
};

export { getIncidents };
