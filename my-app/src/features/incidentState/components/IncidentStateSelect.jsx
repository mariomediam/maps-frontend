import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useIncidentStateStore from '../store/incidentStateStore';

const IncidentStateSelect = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const { incidentStates, isLoading, loadIncidentStates } = useIncidentStateStore();

	// Obtener el valor actual del parámetro de URL
	const currentStateId = searchParams.get('idState') || '0';

	useEffect(() => {
		// Cargar estados solo si no están cargados
		loadIncidentStates();
	}, [loadIncidentStates]);

	// Función para manejar el cambio del select
	const handleStateChange = (event) => {
		const selectedStateId = event.target.value;
		
		// Actualizar los parámetros de URL
		const newSearchParams = new URLSearchParams(searchParams);
		
		if (selectedStateId === '0') {
			// Si es "Todos", eliminar el parámetro
			newSearchParams.delete('idState');
		} else {
			// Establecer el nuevo valor
			newSearchParams.set('idState', selectedStateId);
		}
		
		setSearchParams(newSearchParams);
	};

	return (
		<div>
			<form className="">
				<label
					htmlFor="incident_state_select"
					className="text-[12px] text-gray-500 pb-0 mb-0"
				>
					Estado
				</label>
				<select
					id="incident_state_select"
					value={currentStateId}
					onChange={handleStateChange}
					className="block py-1 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-primary appearance-none  focus:outline-none focus:ring-0 focus:border-gray-200 peer mt-0"
				>
					{isLoading ? (
						<option value="0">Cargando...</option>
					) : (
						incidentStates.map(({ id_state, description }) => (
							<option key={id_state} value={id_state}>
								{description}
							</option>
						))
					)}
				</select>
			</form>
		</div>
	);
};

export default IncidentStateSelect;
