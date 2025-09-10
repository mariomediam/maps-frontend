import { useEffect, useState } from 'react';
import IncidentFilter from "@/features/incident/components/IncidentFilter.jsx";
import useIncidentsStore from "@/features/incident/store/incidentStore.js";
import { IncidentDetail } from "@/features/incident/components/IncidentDetail.jsx";
import useWindowStore from "@/shared/store/windowStore";

const MapSidebar = ({ className, onClose }) => {
  const incidentSelected = useIncidentsStore((state) => state.incidentSelected);
  const showMapFilters = useIncidentsStore((state) => state.showMapFilters);
  const showMapDetail = useIncidentsStore((state) => state.showMapDetail);
  const isMobile = useWindowStore((state) => state.isMobile);
  const [classNameFilter, setClassNameFilter] = useState("");
  const [classNameDetail, setClassNameDetail] = useState("");

  const getClassNameFilter = () => {
    // En desktop: mostrar cuando showMapFilters es true y no hay detalle
    if (!isMobile) {
      return showMapFilters && !showMapDetail ? "h-full" : "hidden";
    }
    
    // En móvil: mostrar cuando showMapFilters es true
    if (isMobile && showMapFilters) {
      return "h-full";
    }
    
    return "hidden";
  };

  const getClassNameDetail = () => {
    // En desktop: mostrar cuando showMapDetail es true
    if (!isMobile) {
      return showMapDetail && incidentSelected ? "h-full" : "hidden";
    }
    
    // En móvil: mostrar cuando hay incidente seleccionado y showMapDetail es true
    if (isMobile && showMapDetail && incidentSelected) {
      return "h-full";
    }
    
    return "hidden";
  };

  useEffect(() => {
    setClassNameFilter(getClassNameFilter());
  }, [incidentSelected, isMobile, showMapFilters, showMapDetail]);

  useEffect(() => {
    setClassNameDetail(getClassNameDetail());
  }, [incidentSelected, isMobile, showMapFilters, showMapDetail]);

  
  return (
    <div className={`${className} flex flex-col`}>
      <IncidentFilter className={classNameFilter} onClose={onClose} />
      <IncidentDetail
        incident={incidentSelected}
        className={classNameDetail}
        onClose={onClose}
      />
    </div>
  );
};
export default MapSidebar;
