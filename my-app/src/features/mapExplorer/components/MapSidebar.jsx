import IncidentFilter from "@/features/incident/components/IncidentFilter.jsx";
import useIncidentsStore from "@/features/incident/store/incidentStore.js";
import { IncidentDetail } from "@/features/incident/components/IncidentDetail.jsx";
import useWindowStore from "@/shared/store/windowStore";
import { useState, useEffect } from "react";

const MapSidebar = ({ className, onClose }) => {
  const incidentSelected = useIncidentsStore((state) => state.incidentSelected);
  const isMobile = useWindowStore((state) => state.isMobile);
  const [classNameSideBar, setClassNameSideBar] = useState("");
  const showMapFilters = useIncidentsStore((state) => state.showMapFilters);


  const getClassNameSideBar = () => {
    let className = "";
    if (isMobile && !showMapFilters && !incidentSelected) {
      return "hidden";
    }
    if (isMobile && (showMapFilters || incidentSelected)) {
      return "w-full";
    }
    if (!isMobile) {
      return "w-1/3";
    }
    return className;
  }

  useEffect(() => {
    setClassNameSideBar(getClassNameSideBar());
  }, [incidentSelected, isMobile, showMapFilters]);
  

  return (
    <div className={classNameSideBar}>
      <IncidentFilter className="" onClose={onClose} />
      <IncidentDetail
        incident={incidentSelected}
        className=""
        onClose={onClose}
      />
    </div>
  );
};
export default MapSidebar;
