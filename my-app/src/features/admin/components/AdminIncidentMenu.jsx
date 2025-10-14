import DotsVerticalIcon from "@/shared/assets/icons/DotsVerticalIcon";
import EditIcon from "@/shared/assets/icons/EditIcon";
import EyeIcon from "@/shared/assets/icons/EyeIcon";
import FlagIcon from "@/shared/assets/icons/FlagIcon";
import PlusIcon from "@/shared/assets/icons/PlusIcon";
import TrashIcon from "@/shared/assets/icons/TrashIcon";
import WorldIcon from "@/shared/assets/icons/WorldIcon";
import WorldXIcon from "@/shared/assets/icons/WorldXIcon";

const AdminIncidentMenu = ({ incident }) => {
  const { id_incident, show_on_map } = incident;
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
              onClick={(e) => {
                e.preventDefault();
                console.log("Editar incidente", id_incident);
              }}
            >
              <EyeIcon />
              <span className="ms-1">Ver detalle</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-1 hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault();
                console.log("Ver detalle", id_incident);
              }}
            >
              <EditIcon />
              <span className="ms-1">Editar</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-1 hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault();
                console.log("Cambiar estado", id_incident);
              }}
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
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-1 hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault();
                console.log("Ver detalle", id_incident);
              }}
            >
              <PlusIcon />
              <span className="ms-1">Añadir datos</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-1 hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault();
                console.log("Ver detalle", id_incident);
              }}
            >
              <FlagIcon width={18} height={18}  />
              <span className="ms-1">Finalizar</span>
            </a>
          </li>
          <li className="border-t border-gray-200 mt-2 pt-2">
            <a
              href="#"
              className="flex items-center px-4 py-1 hover:bg-gray-100 text-red-600 hover:text-red-700"
              onClick={(e) => {
                e.preventDefault();
                console.log("Eliminar", id_incident);
              }}
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
