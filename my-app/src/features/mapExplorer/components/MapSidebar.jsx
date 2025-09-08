import IncidentFilters from "@/features/incident/components/IncidentFilters.jsx";

const MapSidebar = ({ className, onClose }) => {
  return (
    <IncidentFilters className={className} onClose={onClose} />
  );
};
export default MapSidebar;
