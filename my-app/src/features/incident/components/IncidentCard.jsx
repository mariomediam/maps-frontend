import IncidentCardItem from "./IncidentCardItem";
import useIncidentsStore from "@/features/incident/store/incidentStore.js";

const IncidentCard = () => {
  const incidentsStored = useIncidentsStore((state) => state.incidentsStored);

  return (
    <div>
      <label
        htmlFor="incident_state_select"
        className="text-[12px] text-gray-500 mb-10"
      >
        Últimos incidentes registrados
      </label>
      <section className="mt-1">
        {incidentsStored.map((incident) => (
          <IncidentCardItem key={incident.id_incident} incident={incident} />
        ))}
      </section>
    </div>
  );
};

export default IncidentCard;
