import MapSidebar from "@features/mapExplorer/components/MapSidebar";
import MapView from "@features/mapExplorer/components/MapView";
import { useState } from "react";
import MainHeader from "@/shared/components/MainHeader";

const MapExplorerPage = () => {
	const [showMobileFilters, setShowMobileFilters] = useState(false);

	const toggleMobileFilters = () => {
		setShowMobileFilters(!showMobileFilters);
	};

	return (
		<div className="h-screen flex flex-col">
			<MainHeader />
			<div className="flex flex-1">
				{/* Sidebar - Desktop: siempre visible | Móvil: solo cuando showMobileFilters es true */}
				<MapSidebar
					className={`
						w-full md:w-1/3
						${showMobileFilters ? "block" : "hidden md:block"}
					`}
					onClose={() => setShowMobileFilters(false)}
				/>

				{/* MapView - Desktop: siempre visible | Móvil: solo cuando showMobileFilters es false */}
				<MapView
					className={`
						w-full md:w-2/3
						${showMobileFilters ? "hidden md:block" : "block"}
					`}
					onToggleFilters={toggleMobileFilters}
				/>
			</div>
		</div>
	);
};

export default MapExplorerPage;
