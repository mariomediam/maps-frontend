import MapSidebar from '@features/mapExplorer/components/MapSidebar';
import MapView from '@features/mapExplorer/components/MapView';
import { useEffect, useState } from 'react';
import MainHeader from '@/shared/components/MainHeader';
import useWindowStore from '@/shared/store/windowStore';
import { initBreakpointListeners } from '@/shared/store/windowStore';
import useIncidentsStore from '@/features/incident/store/incidentStore';


const MapExplorerPage = () => {
	// const [showMobileFilters, setShowMobileFilters] = useState(false);
	const { isMobile } = useWindowStore();
	const { showMapFilters, toggleShowMapFilters, setShowMapFilters, incidentSelected } = useIncidentsStore();

	// const toggleMobileFilters = () => {
	// 	setShowMobileFilters(!showMobileFilters);
	// };

	useEffect(() => {
		const cleanup = initBreakpointListeners();
    	return cleanup;
	}, []);

	return (
		<div className="h-screen flex flex-col">
			<MainHeader />
			<div>
				<p>
				{isMobile ? 'Mobile' : 'Desktop'} - {incidentSelected ? "Incidente seleccionado" : "Incidente no seleccionado"}
					</p>
					

			</div>
			<div className={`flex flex-1 ${isMobile && incidentSelected ? "flex-col flex-col-reverse" : ""}`}>
				
				<MapSidebar
					className=""
					onClose={() => setShowMapFilters(false)}
				/>

				
				<MapView
					className=""
					onToggleFilters={toggleShowMapFilters}
				/>
			</div>
		</div>
	);
};

export default MapExplorerPage;
