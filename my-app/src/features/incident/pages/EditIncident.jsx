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
import { getIncidentPhotographyBlobById } from '@/features/incident/services/incidentApi';



export const EditIncident = () => {
  const navigate = useNavigate();
  const selectedIncident = useIncidentsStore((state) => state.selectedIncident);
  const incidentAdded = useIncidentsStore((state) => state.incidentAdded);
  const setIncidentAdded = useIncidentsStore((state) => state.setIncidentAdded);
  const resetIncidentAdded = useIncidentsStore(
    (state) => state.resetIncidentAdded
  );
  const updateIncidentFromStore = useIncidentsStore((state) => state.updateIncidentFromStore);

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const setIncidentSelectedFromStore = useIncidentsStore((state) => state.setIncidentSelectedFromStore);

  const steps = [
    {
      label: "Seleccionar categoría",
      component: (
        <SelectCategory categories={categories} isLoading={isLoading} />
      ),
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

  const createIncidentFromStore = useIncidentsStore(
    (state) => state.createIncidentFromStore
  );
  const isCreatingIncident = useIncidentsStore((state) => state.isLoading);
  const createIncidentError = useIncidentsStore((state) => state.error);
  const searchIncidentsStored = useIncidentsStore((state) => state.searchIncidentsStored);

  const handleComplete = async () => {
    try {
      setIsLoading(true);

      const newIncident = await updateIncidentFromStore();      
      let filtersToSend = { idIncident: newIncident.id_incident };      
      await searchIncidentsStored(filtersToSend);      

      setIsLoading(false);

      toast.success("Incidente actualizado exitosamente");

      // Agregar un delay más largo en producción para asegurar que el store se actualice
      // y dar tiempo a que la API procese la creación del incidente
      const isProduction = window.location.hostname !== "localhost";
      const delay = isProduction ? 1000 : 100;

      setTimeout(() => {
        // console.log('🧭 [ReportIncident] Ejecutando navegación...');
        navigate(`/admin-incident`, {
          replace: true,
        });
      }, delay);
    } catch (error) {
      console.error("❌ [ReportIncident] Error crítico al crear incidente:", {
        error: error.message,
        stack: error.stack,
        incidentData: incidentAdded,
        connectionType: navigator.connection?.effectiveType || "unknown",
        timestamp: new Date().toISOString(),
      });

      // alert(`Error al reportar la incidencia: ${error.message || 'Error desconocido'}`);
      setIsLoading(false);
    }
  };

  const handleStepChange = (stepIndex, stepData) => {
    // console.log(`Cambió al paso ${stepIndex + 1}:`, stepData.label);
    // Aquí puedes agregar lógica adicional después del cambio de paso
  };

  const handleBeforeStepChange = (
    currentStepIndex,
    nextStepIndex,
    currentStepData,
    nextStepData
  ) => {
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
    if (nextStepIndex === "complete") {
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

  const setIncidentAddedFromSelectedIncident = async () => {
    try {
      // Obtener las fotografías existentes como blobs
      const photographsWithBlobs = await Promise.all(selectedIncident.photographs.map(photo => getIncidentPhotographyBlobById(photo.id_photography)));

      // Establecer datos incluyendo URLs de fotografías existentes
      setIncidentAdded({
        category_id: selectedIncident.category,
        latitude: selectedIncident.latitude,
        longitude: selectedIncident.longitude,
        summary: selectedIncident.summary,
        reference: selectedIncident.reference,
        id_incident: selectedIncident.id_incident,
        files: photographsWithBlobs
      });
      
      console.log('✅ Datos del incidente cargados (con URLs de fotos)');
    } catch (error) {
      console.error('❌ Error cargando datos del incidente:', error);
      toast.error('Error al cargar los datos del incidente');
    }
  };

  useEffect(() => {
    const loadIncidentData = async () => {
      try {
        setIsLoading(true);
        
        // Cargar categorías
        const categories = await getIncidentCategories({ isActive: true });
        setCategories(categories);
        
        // Cargar datos del incidente incluyendo imágenes
        await setIncidentAddedFromSelectedIncident();
        
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error('Error fetching categories:', error);
        toast.error('Error al cargar los datos del incidente');
      }
    };
    
    loadIncidentData();
  }, []); // S

  const handleClose = () => {
    resetIncidentAdded();
    navigate("/admin-incident", { replace: true });
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
          Editar incidencia {selectedIncident.id_incident}
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

export default EditIncident;
