import { useEffect, useState } from "react";
import IncidentFilter from "@/features/incident/components/IncidentFilter.jsx";
import useIncidentsStore from "@/features/incident/store/incidentStore.js";
import { IncidentDetail } from "@/features/incident/components/IncidentDetail.jsx";
import useWindowStore from "@/shared/store/windowStore";

const MapSidebar = ({ isMobile, setShowSideBar }) => {
  const onClickCloseButton = () => {
    setShowSideBar(false);
  };

  return (
    <div className="flex justify-between">
      <p>Filtros y ultimos incidentes</p>

      {isMobile && (
        <button
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none "
        onClick={onClickCloseButton}
      >
       X
      </button>
      )}
      
    </div>
  );
};
export default MapSidebar;
