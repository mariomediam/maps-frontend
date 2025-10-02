import { MapIncidentList } from "@features/mapExplorer/components/MapIncidentList";
import { MapIncidentSelected } from "@features/mapExplorer/components/MapIncidentSelected";

const MapView = ({ isMobile, selectedIncident, setSelectedIncident }) => {
  if (isMobile && selectedIncident) {
    return (
      <MapIncidentSelected
        isMobile={isMobile}
        selectedIncident={selectedIncident}
      />
    );
  }

  return (
    <MapIncidentList
      isMobile={isMobile}
      selectedIncident={selectedIncident}
      setSelectedIncident={setSelectedIncident}
    />
  );
};

export default MapView;
