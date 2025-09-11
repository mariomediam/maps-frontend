import MapSidebar from '@features/mapExplorer/components/MapSidebar';
import MapView from '@features/mapExplorer/components/MapView';
import { useEffect, useState } from 'react';
import MainHeader from '@/shared/components/MainHeader';
import useWindowStore from '@/shared/store/windowStore';
import { initBreakpointListeners } from '@/shared/store/windowStore';
import useIncidentsStore from '@/features/incident/store/incidentStore';
import { useSearchParams } from 'react-router-dom';
import FilterIcon from '@/shared/assets/icons/FilterIcon';


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

	// Escuchar cambios en searchParams para actualizar filtros
	useEffect(() => {
		const updateIncidentsWithFilters = async () => {
			try {
				const filters = {};
				const idCategory = searchParams.get('idCategory');
				const idState = searchParams.get('idState');
				
				if (idCategory && idCategory !== '0') filters.idCategory = idCategory;
				if (idState && idState !== '0') filters.idState = idState;
				
				console.log('🔍 Actualizando incidentes con filtros:', filters);
				await searchIncidentsStored(filters);
			} catch (error) {
				console.error('Error actualizando incidentes con filtros:', error);
			}
		};

		// Solo ejecutar si ya se han cargado los incidentes inicialmente
		if (incidentsStored.length > 0 || searchParams.has('idCategory') || searchParams.has('idState')) {
			updateIncidentsWithFilters();
		}
	}, [searchParams]); // Se ejecuta cada vez que cambien los searchParams

	  


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
								<div className="bg-header-500 p-2 flex items-center justify-center shrink-0">
									<button
										type="button"
										className="text-primary text-sm font-medium cursor-pointer hover:text-primary transition-colors"
										onClick={toggleMapExpanded}
									>
										{isMapExpanded ? 'Contraer mapa' : 'Expandir mapa'}
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
							<div className="w-full h-full flex flex-col relative">
								{/* Botón "Mostrar filtros" - Fijo en la parte superior */}
								<div className="bg-header-500 p-2 flex items-center justify-center shrink-0">
									<button
										type="button"
										className="text-primary text-sm font-medium cursor-pointer hover:text-primary transition-colors"
										onClick={toggleShowMapFilters}
									>
										<div className="flex items-center gap-1">
											<FilterIcon /> Mostrar filtros
										</div>
									</button>
								</div>
								
								<MapView
									className="w-full flex-1"
									onToggleFilters={toggleShowMapFilters}
								/>
							</div>
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
