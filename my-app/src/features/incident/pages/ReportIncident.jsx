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


export const ReportIncident = () => {
  const incidentAdded = useIncidentsStore((state) => state.incidentAdded);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  
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

  const handleComplete = () => {
    console.log("Formulario completado - Enviando datos...");
    // Aquí puedes agregar la lógica para enviar los datos del formulario
    alert("¡Incidencia reportada exitosamente!");
  };

  const handleStepChange = (stepIndex, stepData) => {
    console.log(`Cambió al paso ${stepIndex + 1}:`, stepData.label);
    // Aquí puedes agregar lógica para validar o guardar datos del paso anterior
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


  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
      {JSON.stringify(incidentAdded)}

      <div className="container mx-auto px-4 py-6">
      <div className="max-w-6xl w-full flex items-center justify-end me-1 my-0">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 my-0"
              // onClick={handleClose}
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
            showStepLabels={true}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ReportIncident;
