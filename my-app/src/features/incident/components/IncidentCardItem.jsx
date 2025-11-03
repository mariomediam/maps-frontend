import IncidentPhotography from "@/features/incident/components/IncidentPhotography";
import { format } from "@formkit/tempo";
import useIncidentsStore from "@/features/incident/store/incidentStore.js";
import useMapExplorerStore from "@features/mapExplorer/store/mapExplorerStore.js";
import IncidentMiniature from "@/features/incident/components/IncidentMiniature";

const IncidentCardItem = ({ incident, className, showModalIncident  }) => {
  const {
    summary,
    id_incident,
    registration_date,
    category_name,
    photographs,
  } = incident;

  const setSelectedIncident = useIncidentsStore((state) => state.setSelectedIncident);
  const setShowSideBar = useMapExplorerStore((state) => state.setShowSideBar);

  const firstPhotography = photographs[0];



  const idPhotography = firstPhotography?.id_photography;

  const setIncidentSelectedFromStore = useIncidentsStore(
    (state) => state.setIncidentSelectedFromStore
  );

  const handleIncidentSelected = () => {    
    if (!showModalIncident) {      
      setShowSideBar(false);
      setSelectedIncident(incident);
    } else {      
      setSelectedIncident(incident);
      showModalIncident(true);
    }
  };

  return (
    <article
      className={`bg-gray-500  ${className}`}
      onClick={handleIncidentSelected}
    >
      <a
        href="#"
        className="flex flex-col items-start bg-secondary border-t border-gray-300 pt-1 shadow-sm md:flex-row  hover:bg-header-500 "
      >
        {/* md:max-w-xl */}
        <div className="flex justify-between  w-full gap-1 p-1">
          <div className="flex flex-col justify-between leading-normal">
            <p className="mb-2tracking-tight text-primary text-sm">{summary}</p>
            <p className="mb-3  text-xs text-gray-500 ">
              {format(registration_date, "DD/MM/YYYY HH:mm")}
            </p>
          </div>

          <div className="flex justify-end ">
            <IncidentMiniature idIncident={id_incident} idPhotography={idPhotography} />
          </div>
        </div>
      </a>
    </article>
  );
};

export default IncidentCardItem;
