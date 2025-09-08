import L from "leaflet";
import { useEffect, useState } from "react";
import {
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useSearchParams } from "react-router-dom";
import FilterIcon from "@/shared/assets/icons/FilterIcon";
import { MAP_ACTION_TYPES } from "@/shared/constants/mapConstants";
import useIncidentsStore from "@/features/incident/store/incidentStore.js";


// Función para crear un ícono SVG de marcador de posición personalizado
const getColoredIcon = (color) => {
	return L.divIcon({
		className: "",
		html: `
		<svg width="32" height="32" viewBox="0 0 32 32">
		  <path d="M16 2C10.477 2 6 6.477 6 12c0 7.732 8.003 17.292 8.343 17.677a1 1 0 0 0 1.314 0C17.997 29.292 26 19.732 26 12c0-5.523-4.477-10-10-10zm0 13.5A3.5 3.5 0 1 1 16 8a3.5 3.5 0 0 1 0 7.5z" fill="${color}" stroke="#333" stroke-width="2"/>
		</svg>
	  `,
		iconSize: [32, 32],
		iconAnchor: [16, 32],
		popupAnchor: [0, -32],
	});
};

const AddMarkerOnDblClick = ({ action, setTempMarker }) => {
	useMapEvents({
		dblclick(e) {
			if (action === MAP_ACTION_TYPES.adding) {
				setTempMarker({ lat: e.latlng.lat, lng: e.latlng.lng });
			}
		},
	});
	return null;
};

const MapView = ({ className, onToggleFilters, hideReportButton = false }) => {
	const [searchParams] = useSearchParams();
	const position = [51.505, -0.09];

	const [actionType, setActionType] = useState(MAP_ACTION_TYPES.listing);
	const [idProblemSelected, setIdProblemSelected] = useState(null);
	const [tempMarker, setTempMarker] = useState(null);

	const incidentsStored = useIncidentsStore((state) => state.incidentsStored)
	const searchIncidentsStored = useIncidentsStore((state) => state.searchIncidentsStored)
	const incidents = useIncidentsStore((state) => state.incidentsStored)
	const isLoading = useIncidentsStore((state) => state.isLoading)
	const setSelectedIncident = useIncidentsStore((state) => state.setSelectedIncident)

	// Obtener filtros de la URL
	const idCategory = searchParams.get("idCategory");
	const idState = searchParams.get("idState");

	const getIncidentsApi = async () => {
		try {
			const filters = {};
			
			// Agregar filtros si existen en la URL
			if (idCategory) filters.idCategory = idCategory;
			if (idState) filters.idState = idState;
			
			// console.log("Filtros aplicados:", filters); // Para debug


			await searchIncidentsStored(filters);

		} catch (error) {
			console.error("Error cargando incidentes:", error);
		} finally {
		}
	};

	// Recargar incidentes cuando cambien los parámetros de URL
	useEffect(() => {
		getIncidentsApi();
	}, [idCategory, idState]);

	// Limpiar marcador temporal al salir de modo adding
	useEffect(() => {
		if (actionType !== MAP_ACTION_TYPES.adding) {
			setTempMarker(null);
		}
	}, [actionType]);

	return (
		<div className={`w-full h-full relative ${className}`}>
			{/* Overlay de loading */}
			{isLoading && (
				<div className="absolute inset-0 bg-secondary  flex items-center justify-center z-1000">
					<div className="bg-white rounded-lg p-6 shadow-lg flex flex-col items-center">
						<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mb-3"></div>
						<p className="text-sm text-gray-600">Cargando incidentes...</p>
					</div>
				</div>
			)}

			{/* Botón "Mostrar filtros" - Solo visible en móvil y cuando no hay incidente seleccionado */}
			{!hideReportButton && (
				<div className="bg-header-500 p-2 flex items-center justify-center md:hidden">
					<button
						type="button"
						className="text-primary text-sm font-medium cursor-pointer hover:text-primary transition-colors"
						onClick={onToggleFilters}
					>
						<div className="flex items-center gap-1">
							<FilterIcon /> Mostrar filtros
						</div>
					</button>
				</div>
			)}

			{/* Botón "Reportar una incidencia" - Flotante sobre el mapa */}
			{!hideReportButton && (
				<div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-1000">
					<button
						type="button"
						className="bg-primary text-white px-6 py-3 rounded-lg shadow-lg hover:bg-primary/90 transition-colors font-medium text-sm"
						onClick={() => setActionType(MAP_ACTION_TYPES.adding)}
					>
						Reportar una incidencia
					</button>
				</div>
			)}
			<MapContainer
				center={[-5.1955724, -80.6301423]}
				zoom={14}
				scrollWheelZoom={true}
				style={{ height: "100%", width: "100%" }}
				doubleClickZoom={false}
				className={isLoading ? "opacity-50 pointer-events-none" : ""}
			>
				<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
				<AddMarkerOnDblClick
					action={actionType}
					setTempMarker={setTempMarker}
				/>
				{/* Marcador temporal al agregar */}
				{actionType === MAP_ACTION_TYPES.adding && tempMarker && (
					<Marker
						position={tempMarker}
						icon={getColoredIcon("#C82333")}
						draggable={true}
						eventHandlers={{
							dragend: (e) => {
								setTempMarker(e.target.getLatLng());
							},
						}}
					/>
				)}

				{/* Marcadores normales */}
				{actionType !== MAP_ACTION_TYPES.adding && (
					<>
						{incidentsStored.map((incident) => (
							<Marker
								key={incident.id_incident}
								position={[incident.latitude, incident.longitude]}
								icon={getColoredIcon(incident.color_state)}
								eventHandlers={{
								  mousedown: (e) => {
									setSelectedIncident(incident);
								  }
								}}
							>
								<Popup>{incident.summary}</Popup>
							</Marker>
						))}
					</>
				)}
			</MapContainer>
		</div>
	);
};

export default MapView;
