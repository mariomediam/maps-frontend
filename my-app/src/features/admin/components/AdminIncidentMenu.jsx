import DotsVerticalIcon from "@/shared/assets/icons/DotsVerticalIcon";
import EditIcon from "@/shared/assets/icons/EditIcon";
import EyeIcon from "@/shared/assets/icons/EyeIcon";
import LockIcon from "@/shared/assets/icons/LockIcon";
import PlusIcon from "@/shared/assets/icons/PlusIcon";
import TrashIcon from "@/shared/assets/icons/TrashIcon";
import WorldIcon from "@/shared/assets/icons/WorldIcon";
import WorldXIcon from "@/shared/assets/icons/WorldXIcon";
import useIncidentsStore from "@features/incident/store/incidentStore";
import LockOpenIcon from "@/shared/assets/icons/LockOpenIcon";
import { useNavigate } from "react-router-dom";

const AdminIncidentMenu = ({ incident, setOpenModalViewIncident, setOpenModalAdditionalInformation, setOpenModalFinishIncident, setOpenModalReactiveIncident, setOpenModalDeleteIncident }) => {
  const navigate = useNavigate();
  const { id_incident, show_on_map, id_state } = incident;
  const updatePartialIncidentFromStore = useIncidentsStore((state) => state.updatePartialIncidentFromStore);


  const setSelectedIncident = useIncidentsStore((state) => state.setSelectedIncident);

  const onClickVerDetalle = () => {
    setSelectedIncident(incident);
    setOpenModalViewIncident(true);
  };

  const onClickAdditionalInformation = () => {
    setSelectedIncident(incident);
    setOpenModalAdditionalInformation(true);
  };

  const onClickFinishIncident = () => {
    setSelectedIncident(incident);    
    setOpenModalFinishIncident(true);
  };

  const onClickEditIncident = () => {
    setSelectedIncident(incident);
    console.log("incident edit", incident);
    navigate("/edit-incident");
  };

  const onClickReactiveIncident = () => {
    setSelectedIncident(incident);
    setOpenModalReactiveIncident(true);
  };

  const onClickDeleteIncident = () => {
    setSelectedIncident(incident);
    setOpenModalDeleteIncident(true);
  };

  const onClickChangeShowOnMap = async () => {
    const updatedIncidentData = { show_on_map: !show_on_map };
    
    try {
      await updatePartialIncidentFromStore(id_incident, updatedIncidentData);
      
      // 👇 Hacer scroll al incidente actualizado
      setTimeout(() => {
        const element = document.getElementById(`incident-card-${id_incident}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } catch (error) {
      console.error("Error al actualizar incidente:", error);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        data-dropdown-toggle={`dropdown-menu-${id_incident}`}
        className="text-gray-500 hover:text-gray-700 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 my-0"
        aria-label="Abrir menú de acciones"
      >
        <DotsVerticalIcon />
      </button>

      <div
        id={`dropdown-menu-${id_incident}`}
        className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 border border-gray-200"
      >
        <ul className="py-1 text-sm text-gray-700">
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-1 hover:bg-gray-100"
              onClick={onClickVerDetalle}
            >
              <EyeIcon />
              <span className="ms-1">Ver detalle</span>
            </a>
          </li>
          { id_state !== 3 && (
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-1 hover:bg-gray-100"
              onClick={onClickEditIncident}
            >
              <EditIcon />
              <span className="ms-1">Editar</span>
            </a>
          </li>
          )}          
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-1 hover:bg-gray-100"
              onClick={onClickChangeShowOnMap}
            >
              {show_on_map ? (
                <>
                  <WorldXIcon />
                  <span className="ms-1">Ocultar en mapa</span>
                </>
              ) : (
                <>
                  <WorldIcon />
                  <span className="ms-1">Hacer público</span>
                </>
              )}
            </a>
          </li>
          { id_state !== 3 && (
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-1 hover:bg-gray-100"
              onClick={onClickAdditionalInformation}
            >
              <PlusIcon />
              <span className="ms-1">Añadir datos</span>
            </a>
          </li>
          )}
          { id_state === 2 && (
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-1 hover:bg-gray-100"
              onClick={onClickFinishIncident}
            >
              <LockIcon  />
              <span className="ms-1">Cerrar</span>
            </a>
          </li>
          )}
          { id_state === 3 && (
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-1 hover:bg-gray-100"
              onClick={onClickReactiveIncident}
            >
              <LockOpenIcon  />
              <span className="ms-1">Reactivar</span>
            </a>
          </li>
          )}
          <li className="border-t border-gray-200 mt-2 pt-2">
            <a
              href="#"
              className="flex items-center px-4 py-1 hover:bg-gray-100 text-red-600 hover:text-red-700"
              onClick={onClickDeleteIncident}
            >
              <TrashIcon />
              <span>Eliminar</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminIncidentMenu;
