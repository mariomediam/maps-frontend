import { useNavigate } from "react-router-dom";

import ListDetailsIcon from "@shared/assets/icons/ListDetailsIcon";
import reportIcon from "@shared/assets/images/report.webp";
import Map2Icon from "@shared/assets/icons/Map2Icon";
import mapImage from "@shared/assets/images/map.webp";
import FileTextIcon from "@shared/assets/icons/FileTextIcon";

const Actions = () => {
  const navigate = useNavigate();

  const handleReportIncident = () => {
    navigate("/add-incident");
  };

  return (
    <section className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm ">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-primary flex items-center">
        <ListDetailsIcon className="me-1" /> Acciones disponibles
      </h5>
      <div className="flex flex-col md:flex-row gap-4">
        <article className="w-full md:w-1/2  bg-white border border-gray-200 rounded-lg shadow-sm ">
          <a href="#">
            <img
              className="rounded-t-lg aspect-16/9 object-cover object-center"
              src={reportIcon}
              alt=""
            />
          </a>
          <div className="p-5">
            <p className="mb-3 text-primary text-sm">
              Informa sobre problemas viales que hayas observado en tu zona de
              manera rápida y sencilla.
            </p>
            <button
              type="button"
              className="w-full bg-primary text-secondary px-6 py-3 rounded-lg shadow-lg hover:bg-black hover:font-bold transition-colors font-medium text-sm flex items-center justify-center cursor-pointer"
              onClick={handleReportIncident}
            >
              <FileTextIcon className="me-1" />
              Reportar una incidencia
            </button>
          </div>
        </article>

        <article className="w-full md:w-1/2  bg-white border border-gray-200 rounded-lg shadow-sm ">
          <a href="#">
            <img
              className="rounded-t-lg aspect-16/9 object-cover object-center"
              src={mapImage}
              alt=""
            />
          </a>
          <div className="p-5">
            <p className="mb-3 text-primary text-sm">
            Visualiza todas las incidencias reportadas en tiempo real con nuestro mapa interactivo.
            </p>
            <button
              type="button"
              className="w-full bg-secondary text-primary px-6 py-3 rounded-lg shadow-lg hover:font-bold transition-colors font-medium text-sm flex items-center justify-center border border-primary cursor-pointer"
              onClick={() => navigate("/map-explorer")}
            >
              <Map2Icon className="me-1" />
              Ver mapa interactivo
            </button>
          </div>
        </article>
      </div>
    </section>
  );
};

export default Actions;
