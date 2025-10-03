import { useState, useEffect, useMemo } from "react";

export const useMapLayout = ({ isMobile, selectedIncident, showSideBar, expandMap }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Calcular visibilidad de componentes usando useMemo para optimizar
  const componentVisibility = useMemo(() => ({
    sidebar: !selectedIncident && (!isMobile || showSideBar),
    map: !isMobile || !showSideBar,
    detail: !!selectedIncident,
    showSidebarButton: isMobile && !selectedIncident && !showSideBar,
    expander: isMobile && !!selectedIncident
  }), [isMobile, selectedIncident, showSideBar]);

  // Calcular clases CSS usando useMemo para optimizar
  const cssClasses = useMemo(() => {
    const getPageClasses = () => {
      let classes = "bg-secondary flex-auto overflow-hidden";
      
      if (!isMobile) {
        classes += " flex";
        if (selectedIncident) {
          classes += " flex-row-reverse";
        }
      } else {
        classes += showSideBar ? " flex flex-auto" : " flex flex-col";
      }
      
      return classes;
    };

    const getSidebarClasses = () => {
      let classes = "bg-red-500 text-secondary flex flex-col flex-auto overflow-y-auto";
      if (!isMobile) {
        classes += " w-1/4";
      }
      return classes;
    };

    const getMapViewClasses = () => {
      let classes = "flex flex-col bg-green-500 border-red-500 border-4 ";
      
      if (!isMobile) {
        classes += " w-3/4";
      } else {
        classes += " flex-auto";
        if (!expandMap && selectedIncident) {
          classes += " h-[120px]";
        }
      }
      
      return classes;
    };

    // const getIncidentDetailClasses = () => {
    //   let classes = "flex-auto";
      
    //   if (!isMobile) {
    //     classes += " w-1/4";
    //   } else if (expandMap) {
    //     classes += " hidden";
    //   }
      
    //   return classes;
    // };

    const getIncidentDetailClasses = () => {
      let classes = "";
      
      if (!isMobile) {
        classes += " w-1/4";
      } else if (expandMap) {
        classes += " hidden";
      } else {
        // En móvil con incidente seleccionado, usar flex-1 para ocupar el resto del espacio
        // y permitir scroll interno
        classes += " flex-1 overflow-y-auto";
      }
      
      return classes;
    };

    return {
      page: getPageClasses(),
      sidebar: getSidebarClasses(),
      mapView: getMapViewClasses(),
      incidentDetail: getIncidentDetailClasses()
    };
  }, [isMobile, selectedIncident, showSideBar, expandMap]);

  return {
    componentVisibility,
    cssClasses,
    isInitialized
  };
};
