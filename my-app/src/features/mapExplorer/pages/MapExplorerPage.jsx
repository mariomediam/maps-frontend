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
				{isMobile ? 'Mobile' : 'Desktop'}
					</p>
					{JSON.stringify(incidentSelected)}

			</div>
			<div className="flex flex-1">
				{/* Sidebar - Desktop: siempre visible | Móvil: solo cuando showMobileFilters es true */}
				<MapSidebar
					className={`
						w-full md:w-1/3
						${showMapFilters ? 'block' : 'hidden md:block'}
					`}
					onClose={() => setShowMapFilters(false)}
				/>

				{/* MapView - Desktop: siempre visible | Móvil: solo cuando showMobileFilters es false */}
				<MapView
					className={`
						w-full md:w-2/3
						${showMapFilters ? 'hidden md:block' : 'block'}
					`}
					onToggleFilters={toggleShowMapFilters}
				/>
			</div>
		</div>
	);
};

export default MapExplorerPage;
