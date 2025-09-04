import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import FilterIcon from "@/shared/assets/icons/FilterIcon";

const MapView = ({ className, onToggleFilters }) => {
	const position = [51.505, -0.09];

	return (
		<div className={`w-full h-full ${className}`}>
			{/* Botón "Mostrar filtros" - Solo visible en móvil */}
			<div className="bg-header-500 p-2 flex items-center justify-center md:hidden">
				<button
					type="button"
					className="text-primary text-sm font-medium cursor-pointer hover:text-primary transition-colors"
					onClick={onToggleFilters}
				>
					<div className="flex items-center gap-1"><FilterIcon /> Mostrar filtros</div>
				</button>
			</div>
			<MapContainer
				center={position}
				zoom={13}
				scrollWheelZoom={false}
				style={{ height: "100%", width: "100%" }}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<Marker position={position}>
					<Popup>
						A pretty CSS3 popup. <br /> Easily customizable.
					</Popup>
				</Marker>
			</MapContainer>
		</div>
	);
};

export default MapView;
