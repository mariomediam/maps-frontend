import useAxios from '@utils/useAxios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const URL = `${API_BASE_URL}/incidents`;

const getIncidents = async (filters = {}) => {
	const { idCategory, idState, showOnMap } = filters;

	try {
		const api = useAxios();

		// Construir parámetros de consulta correctamente
		const queryParams = new URLSearchParams();

		if (idCategory) {
			queryParams.append('id_category', idCategory);
		}
		if (idState) {
			queryParams.append('id_state', idState);
		}
		if (showOnMap) {
			queryParams.append('show_on_map', showOnMap);
		}

		const queryString = queryParams.toString();
		const URLIncidents = queryString ? `${URL}?${queryString}` : URL;

		const {
			data: { content },
		} = await api.get(URLIncidents);

		return content;
	} catch (error) {
		throw error;
	}
};



const getIncidentPhotographyById = async (idPhotography) => {
	try {
		const api = useAxios();

		const { data: { content }, } = await api.get(`${URL}/photography/${idPhotography}`);
		return content;
	} catch (error) {
		console.error(`Error fetching photography ${idPhotography}:`, error);
		throw error;
	}
};

// curl --location 'http://127.0.0.1:8000/incidents/35'

const getIncidentById = async (idIncident) => {
	try {
		const api = useAxios();
		const { data: { content }, } = await api.get(`${URL}/${idIncident}`);
		return content;
	} catch (error) {
		throw error;
	}
};

// Función para crear un nuevo incidente con archivos
const createIncident = async (incidentData) => {
	try {
		const api = useAxios();
		
		// Crear FormData para enviar archivos
		const formData = new FormData();
		
		// Agregar campos de texto
		formData.append('category_id', incidentData.category_id);
		formData.append('latitude', incidentData.latitude);
		formData.append('longitude', incidentData.longitude);
		
		if (incidentData.summary) {
			formData.append('summary', incidentData.summary);
		}
		
		if (incidentData.reference) {
			formData.append('reference', incidentData.reference);
		}
		
		// Agregar archivos (si existen)
		if (incidentData.files && incidentData.files.length > 0) {
			incidentData.files.forEach((file) => {
				formData.append('files', file);
			});
		}
		
		const { data: { content } } = await api.post(`${URL}/`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		
		return content;
	} catch (error) {
		console.error('Error creating incident:', error);
		throw error;
	}
};

export { getIncidents, getIncidentPhotographyById, getIncidentById, createIncident };
