import IncidentFilter from '@/features/incident/components/IncidentFilter.jsx';

const MapSidebar = ({ className, onClose }) => {
	return (
		<IncidentFilter className={className} onClose={onClose} />
	);
};
export default MapSidebar;
