import IncidentCardItem from "./IncidentCardItem"
import useIncidentsStore from "@/features/incident/store/incidentStore.js"

const IncidentCard = () => {
  const incidentsStored = useIncidentsStore((state) => state.incidentsStored)
  
  return (
    <div>
      {incidentsStored.map((incident) => (
        <IncidentCardItem key={incident.id_incident} incident={incident} />
      ))}
    </div>
  )
}

export default IncidentCard