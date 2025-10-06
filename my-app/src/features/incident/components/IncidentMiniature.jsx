import { useState, useEffect } from 'react';
import { getIncidentMiniatureById, getIncidentPhotographyById } from '@/features/incident/services/incidentApi';



const IncidentMiniature = ({ idIncident, idPhotography }) => {
	const [urlPhotography, setUrlPhotography] = useState('');
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchIncidentPhotography = async () => {
			try {
				setIsLoading(true);
				
				const { url : urlMinaiture = ''} = await getIncidentMiniatureById(idIncident);
				if (!urlMinaiture) {
					const { url = ''} = await getIncidentPhotographyById(idPhotography);
					setUrlPhotography(url);
				} else {
					setUrlPhotography(urlMinaiture);
				}
				
			} catch (error) {
				console.error('Error fetching incident photography:', error);
			} finally {
				setIsLoading(false);
			}
			// setUrlPhotography(url);
		};
		if (idPhotography) {
			fetchIncidentPhotography();
		} else {
			setIsLoading(false);
		}
	}, [idPhotography]);



	if (!idPhotography) {
		return (<div className="w-16 h-16 flex-shrink-0">
			<div className="flex justify-center items-center h-full text-gray-500 text-xs text-center">
				Sin fotografía
			</div>
		</div>);
	}

	

	return (
		<div className="w-16 h-16 flex-shrink-0">
			{isLoading || urlPhotography === '' ? (
				<div className="flex justify-center items-center h-full">
					<div className="animate-spin rounded-full h-2 w-2 border-b-1 border-primary"></div>
				</div>
			) : (
				<img
					className="h-16 w-16 object-cover "
					src={urlPhotography}
					alt="image description"
				/>
			)}
      
		</div>
	);
};

export default IncidentMiniature;
