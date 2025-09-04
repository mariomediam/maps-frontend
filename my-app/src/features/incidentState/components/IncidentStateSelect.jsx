import { useState, useEffect } from "react";
import { getIncidentStates } from "@features/incidentState/services/incidentStateApi";


const IncidentStateSelect = () => {
  const [incidentStates, setIncidentStates] = useState([{ id_state: 0, description: "Cargando..." }]);

  useEffect(() => {
    const fetchIncidentStates = async () => {
      let states = await getIncidentStates();      
      states.unshift({ id_state: 0, description: "Todos" });
      setIncidentStates(states);
    };
    fetchIncidentStates();
  }, []);

  return (
    <div>
    <form className="max-w-sm mx-auto">
      <label htmlFor="incident_state_select" className="text-[12px] text-gray-500 pb-0 mb-0">
        Estado
      </label>
      <select
        id="incident_state_select"
        className="block py-1 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-primary appearance-none  focus:outline-none focus:ring-0 focus:border-gray-200 peer mt-0"
      >
        {incidentStates.map(({ id_state, description }) => (
          <option key={id_state} value={id_state}>
            {description}
          </option>
        ))}
      </select>
    </form>
  </div>
  )
}

export default IncidentStateSelect