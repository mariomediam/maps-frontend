import { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
} from "flowbite-react";
import incidentPriorityData from "@features/incidentPriority/data/incidentPriorityData";
import CancelIcon from "@/shared/assets/icons/CancelIcon";
import DeviceFloppyIcon from "@/shared/assets/icons/DeviceFloppyIcon";
import useIncidentsStore from "@features/incident/store/incidentStore";
import AsyncSelect from "react-select/async";
import { format } from '@formkit/tempo';

import { toast } from "sonner";
import { getTradocByNumero, getTradocByC_Docum } from "../services/adminApi";

const AdditionalInformation = ({ openModal, setOpenModal }) => {
  const updatePartialIncidentFromStore = useIncidentsStore(
    (state) => state.updatePartialIncidentFromStore
  );
  const selectedIncident = useIncidentsStore((state) => state.selectedIncident);
  const setSelectedIncident = useIncidentsStore(
    (state) => state.setSelectedIncident
  );

  const { id_incident } = selectedIncident;
  const [priority, setPriority] = useState(selectedIncident.priority);
  const [derivationDocument, setDerivationDocument] = useState(
    selectedIncident.derivation_document
  );

  const debounceRef = useRef(null);
  const [cDocum, setCDocum] = useState(null);
  const [documentsSearched, setDocumentsSearched] = useState([]);

  useEffect(() => {
    setPriority(selectedIncident.priority);
    setDocumInSelect();
  }, [selectedIncident]);


  const setDocumInSelect = async () => {
    setDerivationDocument(selectedIncident.derivation_document);

    if (!selectedIncident.derivation_document) return;

    const defasultDocumInSelect = {
      value: null,
      label: "Cargando documento...",
    };

    setCDocum(defasultDocumInSelect);

    const {C_Docum, N_TipDoc_Nombre, M_Docum_NumDoc, M_Docum_AnioDoc, N_Docum_Siglas, D_Docum_FecEnv} = await getTradocByC_Docum({ c_docum: selectedIncident.derivation_document });
    const documInSelect = {
      value: C_Docum,
      label: `${N_TipDoc_Nombre} ${M_Docum_NumDoc}-${M_Docum_AnioDoc}-${N_Docum_Siglas} del ${format(D_Docum_FecEnv, "DD/MM/YYYY")}`
    };    
    setCDocum(documInSelect);
  }

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

    let c_docum = cDocum?.value || null;
    
    const updatedIncidentData = {
      priority: priority,
      derivation_document: c_docum,
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

  const getDocumsByNumero = async (inputValue) => {
    if (!inputValue) {
      return [];
    }

    const params = {
      depend: 110683,
      numero: inputValue.trim().padStart(5, "0"),
    };

    const data = await getTradocByNumero(params);
    const docums = data.map(({ C_Docum, t_title }) => ({
      value: C_Docum,
      label: t_title,
    }));
    setDocumentsSearched(data);
    return docums;
  };

  const onChageDerivationDocument = (inputValue) => {
    return new Promise((resolve) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(async () => {
        const data = await getDocumsByNumero(inputValue);
        resolve(data);
      }, 1500);
    });
  };

  return (
    <>
      <Modal
        show={openModal}
        onClose={handleCloseModal}
        className="bg-secondary text-primary relative z-[99999]"
      >
        <ModalHeader className="bg-secondary">
          <span className="text-primary">
            Información adicional {selectedIncident.id_incident}
          </span>
        </ModalHeader>
        <ModalBody className="bg-secondary text-primary">
          {/* <p>statePriority: {priority}</p>
          <p>stateDerivationDocument: {derivationDocument}</p>
          <p>storedPriority: {selectedIncident.priority}</p>
          <p>
            storedDerivationDocument: {selectedIncident.derivation_document}
          </p>
          <p>selectedIncident: {JSON.stringify(selectedIncident)}</p> */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Prioridad 
              </label>
              <ul onChange={(e) => setPriority(e.target.value)}>
                {incidentPriorityData.map(({ id_priority, description }) => (
                  <div className="flex items-center ps-3" key={id_priority}>
                    <input
                      id={`list-radio-${id_priority}`}
                      type="radio"
                      name="list-radio"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
                      value={id_priority}
                      defaultChecked={priority === id_priority}
                    />
                    <label
                      htmlFor={`list-radio-${id_priority}`}
                      className="w-full py-1 ms-2 text-sm text-gray-900 "
                    >
                      {description}
                    </label>
                  </div>
                ))}
              </ul>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Documento 
              </label>
              {/* <select
                onChange={(e) => setDerivationDocument(e.target.value)}
                className="w-full p-2.5 text-sm text-gray-900  rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                value={derivationDocument}
                defaultValue={selectedIncident.derivation_document}
              >
                <option value="1">Informe 00126-2025-SGTyMU-GTT/MPP</option>
                <option value="2">Informe 00127-2025-SGTyMU-GTT/MPP</option>
                <option value="3">Informe 00128-2025-SGTyMU-GTT/MPP</option>
                <option value="4">Informe 00129-2025-SGTyMU-GTT/MPP</option>
                <option value="5">Informe 00130-2025-SGTyMU-GTT/MPP</option>
              </select> */}
              <div>
                <AsyncSelect
                  placeholder=""
                  isClearable
                  noOptionsMessage={() => "Registro no encontrado"}
                  className="z-99999"
                  loadOptions={onChageDerivationDocument}
                  onChange={setCDocum}
                  value={cDocum}
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 99999 }),
                  }}
                />
              </div>
            </div>
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
              Grabar
              <DeviceFloppyIcon />
            </div>
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AdditionalInformation;
