import { useEffect } from "react";
import { initFlowbite } from "flowbite";
import CalendarIcon from "@/shared/assets/icons/CalendarIcon";
import MapPinIcon from "@/shared/assets/icons/MapPinIcon";
import UserIcon from "@/shared/assets/icons/UserIcon";
import WorldIcon from "@/shared/assets/icons/WorldIcon";
import { format } from "@formkit/tempo";
import AdminIncidentMenu from "@features/admin/components/AdminIncidentMenu";

const FONT_STATE_COLOR = {
  "#FFC107": "text-primary",
  "#C82333": "text-secondary",
  "#218838": "text-primary",
};

const AdminIncidentCard = ({ incident }) => {
  const {
    category_name = "",
    summary = "",
    description_state = "",
    color_state = "",
    reference = "",
    id_incident = 0,
    inspector_username = "",
    registration_date = "",
    priority_name = "",
    show_on_map = false,
  } = incident || {};

  const classPillState = `${FONT_STATE_COLOR[color_state]} text-xs font-medium px-2.5 py-1.5 rounded-full ms-2`;

  useEffect(() => {
    initFlowbite();
  }, []);

  const onClickCloseButton = () => {
    console.log("Boton");
  };

  return (
    <div className="border border-gray-300 rounded-lg p-3 mt-3 bg-white">
      <div className="flex justify-between  ">
        <div>
          <div className="flex items-center gap-1 flex-wrap">
            <h4 className="text-base/5 font-semibold text-primary">
              {category_name}
            </h4>
            <span
              className={classPillState}
              style={{ backgroundColor: color_state }}
            >
              {description_state}
            </span>

            {priority_name && (
              <span className="text-xs font-medium px-2.5 py-1.5 rounded-full border border-primary">
                Prioridad {priority_name.toLowerCase()}
              </span>
            )}

            {show_on_map ? (
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full border border-primary">
                <div className="flex items-center gap-1">
                  <WorldIcon /> Público
                </div>
              </span>
            ) : (
              <span className="text-xs font-medium px-2.5 py-1.5 rounded-full border border-primary">
                <p>No mostrar en mapa</p>
              </span>
            )}
          </div>
          <p className="text-sm">
            {" "}
            <span className="text-gray-500">id:</span> {id_incident}
          </p>
        </div>
        <AdminIncidentMenu incident={incident} />
      
      </div>

      <p className="">{summary}</p>

      <div className="flex flex-col md:flex-row justify-between mt-2">
        <div className="flex items-center gap-1 text-sm text-gray-400">
          <CalendarIcon />
          {format(registration_date, "DD/MM/YYYY HH:mm")}
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-400">
          <UserIcon />
          {inspector_username}
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-400">
          <MapPinIcon />
          {reference}
        </div>
      </div>
    </div>
  );
};

export default AdminIncidentCard;
