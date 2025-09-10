export const IncidentDetail = ({ incident, className }) => {
  // const { showMapFilters, toggleShowMapFilters, setShowMapFilters, incidentSelected } = useIncidentsStore();

  return (
    <div className={className}>
      <p>Incidente id: {incident?.id_incident}</p>
    </div>
  );
};
