import { Modal, ModalBody, ModalHeader, ModalFooter } from "flowbite-react";
import CancelIcon from "@/shared/assets/icons/CancelIcon";
import DeviceFloppyIcon from "@/shared/assets/icons/DeviceFloppyIcon";

const FinishIncident = ({ openModal, setOpenModal }) => {
  return (
    <>
      <Modal
        show={openModal}
        onClose={() => setOpenModal(false)}
        className="bg-secondary text-primary relative z-[99999]"
      >
        <ModalHeader className="bg-secondary">
          <span className="text-primary">Finalizar incidencia</span>
        </ModalHeader>
        <ModalBody className="bg-secondary text-primary">
          <div className="space-y-4"></div>
        </ModalBody>
        <ModalFooter
          className="bg-secondary text-primary flex justify-center items-center
      "
        >
          <button
            type="button"
            className="py-2.5 px-5 me-2 text-sm font-medium focus:outline-none bg-white rounded-lg border border-gray-200 hover:border-black  focus:z-10 focus:ring-4 focus:ring-gray-100  cursor-pointer"
            //   onClick={handleCloseModal}
          >
            <div className="flex items-center gap-2">
              Cancelar
              <CancelIcon />
            </div>
          </button>
          <button
            type="button"
            className="text-secondary bg-primary hover:bg-black focus:ring-4 focus:outline-none focus:ring-primary-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 cursor-pointer"
            //   onClick={onClickSave}
          >
            <div className="flex items-center gap-2">
              Grabar
              <DeviceFloppyIcon />
            </div>
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default FinishIncident;
