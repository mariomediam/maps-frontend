import MainHeader from "@/shared/components/MainHeader";
import { Stepper } from "@shared";
import SelectCategory from "../components/ReportIncident/SelectCategory";
import SelectUbication from "../components/ReportIncident/SelectUbication";
import AddPhotography from "../components/ReportIncident/AddPhotography";
import AddAdditionalInformation from "../components/ReportIncident/AddAdditionalInformation";
import CategoryIcon from "@shared/assets/icons/CategoryIcon";
import MapPinIcon from "@shared/assets/icons/MapPinIcon";
import PhotoIcon from "@shared/assets/icons/PhotoIcon";
import MessageExclamationIcon from "@shared/assets/icons/MessageExclamationIcon";
import useIncidentsStore from "@features/incident/store/incidentStore";
import { useState, useEffect } from "react";
import { getIncidentCategories } from "@features/incidentCategory/services/incidentCategoryApi";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";


export const ReportIncident = () => {
  const navigate = useNavigate();
  const incidentAdded = useIncidentsStore((state) => state.incidentAdded);
  const resetIncidentAdded = useIncidentsStore((state) => state.resetIncidentAdded);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const setIncidentSelectedFromStore = useIncidentsStore((state) => state.setIncidentSelectedFromStore);

  
const steps = [
  {
    label: "Seleccionar categoría",
    component: <SelectCategory categories={categories} isLoading={isLoading} />,
    icon: <CategoryIcon />,
  },
  {
    label: "Seleccionar ubicación",
    component: <SelectUbication />,
    icon: <MapPinIcon />,
  },
  {
    label: "Agregar fotografías",
    component: <AddPhotography />,
    icon: <PhotoIcon />,
  },
  {
    label: "Agregar información adicional",
    component: <AddAdditionalInformation />,
    icon: <MessageExclamationIcon />,
  },
];

  const createIncidentFromStore = useIncidentsStore((state) => state.createIncidentFromStore);
  const isCreatingIncident = useIncidentsStore((state) => state.isLoading);
  const createIncidentError = useIncidentsStore((state) => state.error);

  const handleComplete = async () => {
    try {
      setIsLoading(true);
     
      // Validar datos mínimos requeridos
      if (!incidentAdded.latitude || !incidentAdded.longitude) {
        console.error('❌ [ReportIncident] Validación fallida: Falta ubicación');
        alert("Por favor selecciona una ubicación");
        return;
      }
      
      // console.log('🚀 [ReportIncident] Creando incidente...');
      const newIncident = await createIncidentFromStore();            
      setIsLoading(false);

      toast.success("Incidente reportado exitosamente");

      console.log('✅ [ReportIncident] Incidente creado exitosamente:', {
        id: newIncident.id_incident,
        summary: newIncident.summary,
        timestamp: new Date().toISOString()
      });
      
      // Agregar un delay más largo en producción para asegurar que el store se actualice
      // y dar tiempo a que la API procese la creación del incidente
      const isProduction = window.location.hostname !== 'localhost';
      const delay = isProduction ? 500 : 100;
      
      // console.log('🔄 [ReportIncident] Navegando a map-explorer:', {
      //   delay,
      //   isProduction,
      //   newIncidentId: newIncident.id_incident
      // });
      
      setTimeout(() => {
        // console.log('🧭 [ReportIncident] Ejecutando navegación...');
        navigate(`/map-explorer?idIncident=${newIncident.id_incident}`, { replace: true });
      }, delay);
      
      

    
    } catch (error) {
      console.error('❌ [ReportIncident] Error crítico al crear incidente:', {
        error: error.message,
        stack: error.stack,
        incidentData: incidentAdded,
        connectionType: navigator.connection?.effectiveType || 'unknown',
        timestamp: new Date().toISOString()
      });
      
      // alert(`Error al reportar la incidencia: ${error.message || 'Error desconocido'}`);
      setIsLoading(false);
    } 
  };

  const handleStepChange = (stepIndex, stepData) => {
    console.log(`Cambió al paso ${stepIndex + 1}:`, stepData.label);
    // Aquí puedes agregar lógica adicional después del cambio de paso
  };

  const handleBeforeStepChange = (currentStepIndex, nextStepIndex, currentStepData, nextStepData) => {
    
    // Validar cuando intenta pasar del paso 0 (categoría) al paso 1 (ubicación)
    if (currentStepIndex === 0 && nextStepIndex === 1) {
      if (!incidentAdded.category_id) {
        toast.error("Por favor selecciona una categoría antes de continuar");
        return false; // No permitir el cambio
      }
    }
    
    // Validar cuando intenta pasar del paso 1 (ubicación) al paso 2 (fotografías)
    if (currentStepIndex === 1 && nextStepIndex === 2) {
      if (!incidentAdded.latitude || !incidentAdded.longitude) {
        toast.error("Por favor selecciona una ubicación antes de continuar");
        return false; // No permitir el cambio
      }
    }
    
    
    
    
    // Validar cuando intenta pasar del paso 1 (ubicación) al paso 2 (fotografías)
    if (currentStepIndex === 1 && nextStepIndex === 2) {
      if (!incidentAdded.latitude || !incidentAdded.longitude) {
        toast.error("Por favor selecciona una ubicación antes de continuar");
        return false; // No permitir el cambio
      }
    }
    
    // Validar antes de completar el formulario
    if (nextStepIndex === 'complete') {
      if (!incidentAdded.latitude || !incidentAdded.longitude) {
        toast.error("Por favor selecciona una ubicación");
        return false;
      }

      if (incidentAdded.summary === null || incidentAdded.summary === "") {
        toast.error("Por favor agrega un resumen");
        return false;
      }

      if (incidentAdded.reference === null || incidentAdded.reference === "") {
        toast.error("Por favor agrega una referencia");
        return false;
      }
    }
    
    return true; // Permitir el cambio
  };

  useEffect(() => {
    try {
      setIsLoading(true);
      const getCategories = async () => {
        const categories = await getIncidentCategories({ isActive: true });
        setCategories(categories);
        setIsLoading(false);
        return categories;
      };
      getCategories();
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching categories:", error);
    } finally {
      
    }
  }, []);

  const handleClose = () => {
    resetIncidentAdded();
    navigate("/map-explorer", { replace: true });
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
      {/* <p>{JSON.stringify(incidentAdded)}</p> */}

      <div className="container mx-auto px-4 py-6">
      <div className="max-w-6xl w-full flex items-center justify-end me-1 my-0">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 my-0"
              onClick={handleClose}
              aria-label="Cerrar detalle"
            >
              ✕
            </button>
          </div>
        <h1 className="text-2xl text-primary mt-3 mb-8 text-center font-semibold">
          Reportar una incidencia
        </h1>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
          
          <Stepper
            steps={steps}
            onComplete={handleComplete}
            onStepChange={handleStepChange}
            onBeforeStepChange={handleBeforeStepChange}
            showStepLabels={true}
            className="w-full"
            isLoading={isLoading}
          />
        </div>
      </div>
      <Toaster richColors visibleToasts={9} position="bottom-right" />
    </div>
  );
};

export default ReportIncident;
