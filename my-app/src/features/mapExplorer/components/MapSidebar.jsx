import { useEffect, useState } from 'react';
import IncidentFilter from "@/features/incident/components/IncidentFilter.jsx";
import useIncidentsStore from "@/features/incident/store/incidentStore.js";
import { IncidentDetail } from "@/features/incident/components/IncidentDetail.jsx";
import useWindowStore from "@/shared/store/windowStore";

const MapSidebar = ({ className, onClose }) => {
  
  return (
    <div className = "">Filtros y ultimos incidentes</div>

    
  );
};
export default MapSidebar;
