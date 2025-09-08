import MapSidebar from "@features/mapExplorer/components/MapSidebar";
import MapView from "@features/mapExplorer/components/MapView";
import IncidentDetail from "@/features/incident/components/IncidentDetail";
import { useState } from "react";
import MainHeader from "@/shared/components/MainHeader";
import useIncidentsStore from "@/features/incident/store/incidentStore.js";

const MapExplorerPage = () => {
	const [showMobileFilters, setShowMobileFilters] = useState(false);
	const selectedIncident = useIncidentsStore((state) => state.selectedIncident);
	const clearSelectedIncident = useIncidentsStore((state) => state.clearSelectedIncident);


	const toggleMobileFilters = () => {
		setShowMobileFilters(!showMobileFilters);
	};

	const handleCloseIncidentDetail = () => {
		clearSelectedIncident();
		setShowMobileFilters(false); // También cerrar filtros si estaban abiertos
	};

	return (
		<div className="h-screen flex flex-col">
			<MainHeader />
			<div className="flex flex-1 overflow-hidden">
				{/* DESKTOP: Sidebar/IncidentDetail siempre visible */}
				<div className="hidden md:block md:w-1/3">
					{selectedIncident ? (
						<IncidentDetail 
							className="h-full" 
							onClose={handleCloseIncidentDetail} 
						/>
					) : (
						<MapSidebar className="h-full" />
					)}
				</div>

				{/* MÓVIL: Sidebar solo cuando showMobileFilters es true */}
				{showMobileFilters && !selectedIncident && (
					<div className="w-full md:hidden">
						<MapSidebar 
							className="h-full" 
							onClose={() => setShowMobileFilters(false)} 
						/>
					</div>
				)}

				{/* MapView - Responsive */}
				<div className={`
					flex-1 relative
					${showMobileFilters && !selectedIncident ? "hidden" : "flex"}
					${selectedIncident ? "flex-col md:flex-none md:w-2/3" : "md:w-2/3"}
				`}>
					{/* MapView único */}
					<MapView 
						className={`
							w-full 
							${selectedIncident ? "h-1/6 md:h-full" : "h-full"}
						`}
						onToggleFilters={toggleMobileFilters}
						hideReportButton={selectedIncident}
					/>
					
					{/* IncidentDetail en móvil cuando hay incidente seleccionado */}
					{selectedIncident && (
						<div className="flex-1 md:hidden bg-white border-t-2 border-gray-200">
							<IncidentDetail 
								className="h-full" 
								onClose={handleCloseIncidentDetail} 
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default MapExplorerPage;
