import IncidentCardItem from "./IncidentCardItem";
import useIncidentsStore from "@/features/incident/store/incidentStore.js";

const IncidentCard = () => {
  const incidentsStored = useIncidentsStore((state) => state.incidentsStored);


  return (
    <div className="text-start">
      
      <section className="mt-1">
        {incidentsStored.map((incident) => (
          <IncidentCardItem key={incident.id_incident} incident={incident} />
        ))}
      </section>
    </div>
  );
};

export default IncidentCard;
