import MapSidebar from '@features/mapExplorer/components/MapSidebar';
import MapView from '@features/mapExplorer/components/MapView';
import { useEffect, useState } from 'react';
import MainHeader from '@/shared/components/MainHeader';
import useWindowStore from '@/shared/store/windowStore';
import { initBreakpointListeners } from '@/shared/store/windowStore';
import useIncidentsStore from '@/features/incident/store/incidentStore';
import { useSearchParams } from 'react-router-dom';


const MapExplorerPage = () => {
	const { isMobile } = useWindowStore();
	const [searchParams] = useSearchParams();
	const { 
		showMapFilters, 
		showMapDetail, 
		toggleShowMapFilters, 
		setShowMapFilters, 
		incidentSelected, 
		isMapExpanded,
		toggleMapExpanded,
		initializeMapState,
		searchIncidentsStored,
		incidentsStored
	} = useIncidentsStore();
	useEffect(() => {
		const cleanup = initBreakpointListeners();
    	return cleanup;
	}, []);

	// Inicializar el estado cuando cambia el modo móvil/desktop
	useEffect(() => {
		initializeMapState(isMobile);
	}, [isMobile, initializeMapState]);

	// Cargar incidentes solo una vez al montar la página
	useEffect(() => {
		const loadIncidents = async () => {
			if (incidentsStored.length === 0) {
				try {
					const filters = {};
					const idCategory = searchParams.get('idCategory');
					const idState = searchParams.get('idState');
					
					if (idCategory) filters.idCategory = idCategory;
					if (idState) filters.idState = idState;
					
					await searchIncidentsStored(filters);
				} catch (error) {
					console.error('Error cargando incidentes:', error);
				}
			}
		};

		loadIncidents();
	}, []); // Solo se ejecuta una vez al montar

	  

	// Debug: log del estado de renderizado en MapExplorerPage
	console.log('🏠 MapExplorerPage render state:', {
		isMobile,
		showMapFilters,
		showMapDetail,
		incidentSelected: !!incidentSelected,
		incidentSelectedId: incidentSelected?.id_incident,
		isMapExpanded,
		renderCondition1: showMapFilters && !showMapDetail,
		renderCondition2: showMapDetail && incidentSelected,
		renderCondition3: !showMapFilters && !showMapDetail
	});

	return (
		<div className="h-screen flex flex-col">
			<MainHeader />
			
			{/* Layout principal */}
			<div className="flex flex-1 overflow-hidden">
				{isMobile ? (
					// MODO MÓVIL
					<>
						{showMapFilters && !showMapDetail ? (
							// Solo filtros
							<MapSidebar
								className="w-full h-full"
								onClose={() => setShowMapFilters(false)}
							/>
						) : showMapDetail && incidentSelected ? (
							// Incidente seleccionado: mapa + detalle
							<div className="w-full h-full flex flex-col relative">
								{/* Botón Expandir/Contraer - Fijo en la parte superior */}
								<div className="bg-red-500 p-2 flex items-center justify-center border-4 border-yellow-400 z-50 shrink-0">
									<button
										type="button"
										className="bg-blue-500 text-white text-lg font-bold px-6 py-3 border-2 border-black cursor-pointer"
										onClick={() => {
											console.log('🔘 Botón clickeado desde MapExplorerPage! Estado:', { isMapExpanded });
											toggleMapExpanded();
										}}
									>
										{isMapExpanded ? '🔽 CONTRAER MAPA 🔽' : '🔼 EXPANDIR MAPA 🔼'}
									</button>
								</div>
								
								<MapView
									className={isMapExpanded ? "w-full flex-1" : "w-full h-1/5"}
									onToggleFilters={toggleShowMapFilters}
								/>
								{!isMapExpanded && (
									<MapSidebar
										className="w-full flex-1"
										onClose={() => setShowMapFilters(false)}
									/>
								)}
							</div>
						) : (
							// Estado por defecto: solo mapa (incluye casos donde showMapDetail es true pero no hay incidentSelected)
							<MapView
								className="w-full h-full"
								onToggleFilters={toggleShowMapFilters}
							/>
						)}
					</>
				) : (
					// MODO DESKTOP
					<>
						<MapSidebar
							className="w-1/3 h-full"
							onClose={() => setShowMapFilters(false)}
						/>
						<MapView
							className="w-2/3 h-full"
							onToggleFilters={toggleShowMapFilters}
						/>
					</>
				)}
			</div>
		</div>
	);
};

export default MapExplorerPage;
