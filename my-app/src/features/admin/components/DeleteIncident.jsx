import { useState, useEffect } from "react";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "flowbite-react";
import CancelIcon from "@/shared/assets/icons/CancelIcon";
import TrashIcon from "@/shared/assets/icons/TrashIcon";
import useIncidentsStore from "@features/incident/store/incidentStore";
import { toast } from "sonner";
import DeviceFloppyIcon from "@/shared/assets/icons/DeviceFloppyIcon";

const DeleteIncident = ({ openModal, setOpenModal }) => {
    const deleteIncidentFromStore = useIncidentsStore(
        (state) => state.deleteIncidentFromStore
      );
      const selectedIncident = useIncidentsStore((state) => state.selectedIncident);
      const setSelectedIncident = useIncidentsStore(
        (state) => state.setSelectedIncident
      );
    
      const { id_incident } = selectedIncident;
     
      
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
       
        try {
          

          await deleteIncidentFromStore(id_incident);
          
          toast.success("Incidencia eliminada exitosamente");
    
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
          console.error("Error al eliminar incidente:", error);
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
              <span className="text-primary flex items-center gap-2"><TrashIcon /> Eliminar incidencia</span>
            </ModalHeader>
            <ModalBody className="bg-secondary text-primary">
              <div className="space-y-4">
                <p className="text-primary">¿Estás seguro de querer eliminar la incidencia {id_incident}?</p>
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
                className="text-white  bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-primary-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 cursor-pointer"
                onClick={onClickSave}
              >
                <div className="flex items-center gap-2">
                  Eliminar
                  <DeviceFloppyIcon />
                </div>
              </button>
            </ModalFooter>
          </Modal>
        </>
      );
}

export default DeleteIncident