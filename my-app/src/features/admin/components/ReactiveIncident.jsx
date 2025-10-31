import { useState, useEffect } from "react";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "flowbite-react";
import CancelIcon from "@/shared/assets/icons/CancelIcon";
import DeviceFloppyIcon from "@/shared/assets/icons/DeviceFloppyIcon";
import useIncidentsStore from "@features/incident/store/incidentStore";
import { toast } from "sonner";
import LockOpenIcon from "@/shared/assets/icons/LockOpenIcon";

const ReactiveIncident = ({ openModal, setOpenModal }) => {
  const updatePartialIncidentFromStore = useIncidentsStore(
    (state) => state.updatePartialIncidentFromStore
  );
  const selectedIncident = useIncidentsStore((state) => state.selectedIncident);
  const setSelectedIncident = useIncidentsStore(
    (state) => state.setSelectedIncident
  );

  const { id_incident } = selectedIncident;
  const [clousureTypeId, setClousureTypeId] = useState(
    selectedIncident.clousure_type
  );
  const [clousureDescription, setClousureDescription] = useState(
    selectedIncident.clousure_description || ""
  );

  useEffect(() => {
    setClousureTypeId(selectedIncident.closure_type);
    setClousureDescription(selectedIncident.closure_description || "");
  }, [selectedIncident]);

  // 👇 Función para manejar el cierre del modal
  const handleCloseModal = () => {
    setOpenModal(false);
    // 👇 Hacer scroll al incidente actualizado
    setTimeout(() => {
      const element = document.getElementById(`incident-card-${id_incident}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
    setSelectedIncident(null); // 👈 Limpiar selectedIncident
  };

  const onClickSave = async () => {
    const updatedIncidentData = {
      closure_type: null,
      closure_description: null,
      is_closed: false,
    };

    try {
      await updatePartialIncidentFromStore(id_incident, updatedIncidentData);

      toast.success("Información actualizada exitosamente");

      // 👇 Hacer scroll al incidente actualizado
      setTimeout(() => {
        const element = document.getElementById(`incident-card-${id_incident}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);

      // Cerrar modal y limpiar selectedIncident
      handleCloseModal(); // 👈 Usar la función
    } catch (error) {
      console.error("Error al actualizar incidente:", error);
    }
  };

  return (
    <>
      <Modal
        show={openModal}
        onClose={handleCloseModal}
        className="bg-secondary text-primary relative z-[99999]"
      >
        <ModalHeader className="bg-secondary">
          <span className="text-primary flex items-center gap-2"><LockOpenIcon /> Reactivar incidencia</span>
        </ModalHeader>
        <ModalBody className="bg-secondary text-primary">
          <div className="space-y-4">
            <p>¿Estás seguro de querer reactivar la incidencia {id_incident}?</p>
            <p>{selectedIncident.summary}</p>
          </div>
        </ModalBody>
        <ModalFooter
          className="bg-secondary text-primary flex justify-center items-center
      "
        >
          <button
            type="button"
            className="py-2.5 px-5 me-2 text-sm font-medium focus:outline-none bg-white rounded-lg border border-gray-200 hover:border-black  focus:z-10 focus:ring-4 focus:ring-gray-100  cursor-pointer"
            onClick={handleCloseModal}
          >
            <div className="flex items-center gap-2">
              Cancelar
              <CancelIcon />
            </div>
          </button>
          <button
            type="button"
            className="text-secondary bg-primary hover:bg-black focus:ring-4 focus:outline-none focus:ring-primary-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 cursor-pointer"
            onClick={onClickSave}
          >
            <div className="flex items-center gap-2">
              Reactivar
              <DeviceFloppyIcon />
            </div>
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ReactiveIncident;
