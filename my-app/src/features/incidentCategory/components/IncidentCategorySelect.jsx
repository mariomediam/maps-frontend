import { getIncidentCategories } from '@features/incidentCategory/services/incidentCategoryApi';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const IncidentCategorySelect = ({ className = '' }) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [incidentCategories, setIncidentCategories] = useState([
		{ id_category: 0, description: 'Cargando...' },
	]);

	// Obtener el valor actual del parámetro de URL
	const currentCategoryId = searchParams.get('idCategory') || '0';

	useEffect(() => {
		const fetchIncidentCategories = async () => {
			const categories = await getIncidentCategories();
			categories.unshift({ id_category: 0, description: 'Todos' });
			setIncidentCategories(categories);
		};
		fetchIncidentCategories();
	}, []);

	// Función para manejar el cambio del select
	const handleCategoryChange = (event) => {
		const selectedCategoryId = event.target.value;
		
		// Actualizar los parámetros de URL
		const newSearchParams = new URLSearchParams(searchParams);
		
		if (selectedCategoryId === '0') {
			// Si es "Todos", eliminar el parámetro
			newSearchParams.delete('idCategory');
		} else {
			// Establecer el nuevo valor
			newSearchParams.set('idCategory', selectedCategoryId);
		}
		
		setSearchParams(newSearchParams);
	};

	return (
		<div className={className}>
			<form className="">
				<label
					htmlFor="incident_category_select"
					className="text-[12px] text-gray-500 pb-0 mb-0"
				>
					Categoría
				</label>
				<select
					id="incident_category_select"
					value={currentCategoryId}
					onChange={handleCategoryChange}
					className="block py-1 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-primary appearance-none  focus:outline-none focus:ring-0 focus:border-gray-200 peer mt-0"
				>
					{incidentCategories.map(({ id_category, description }) => (
						<option key={id_category} value={id_category}>
							{description}
						</option>
					))}
				</select>
			</form>
		</div>
	);
};

export default IncidentCategorySelect;
