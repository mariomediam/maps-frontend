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
    <>
  
    <div className="flex justify-between p-2 bg-secondary text-primary">
      <h2 className="text-lg font-semibold">Filtros</h2>

      {isMobile && (
         <button
         type="button"
         className="text-gray-500 hover:text-gray-700 text-xl me-4"
         onClick={onClickCloseButton}
       >
         ✕
       </button>
      )}
      
    </div>
    <div className="flex flex-col flex-auto">
      <IncidentFilter />

    </div>
    </>
  );
};
export default MapSidebar;
