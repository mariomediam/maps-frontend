import { useState, useEffect } from "react";
import { getPathByC_Docum } from "@/features/admin/services/adminApi";
import { format } from "@formkit/tempo";

const IncidentDocumPath = ({ c_docum }) => {
  const [path, setPath] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPath = async () => {
      try {
        setIsLoading(true);
        const path = await getPathByC_Docum({ c_docum });
        setPath(path);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPath();
  }, [c_docum]);
  {
    /* <p className="text-sm text-gray-500 mt-1">Escala de prioridad</p> */
  }

  if (!c_docum) return <></>;


  return (
    <div>
      <p className="text-sm text-gray-500 mt-1">Seguimiento de la incidencia</p>

      {isLoading ? (
        <div className="flex items-center mt-2">
          <div className="animate-spin rounded-full h-2 w-2 border-b-1 border-primary"></div>
        </div>
      ) : (
        <div className="px-5 mt-2">
          <ol className="relative border-s border-primary ">
            {path &&
              path.map(
                ({ enlace, Documento, T_Docum_AsuntoFull, D_Docum_FecEnv }) => (
                  <li className="mb-5 ms-4" key={enlace}>
                    <div className="absolute w-3 h-3 bg-primary rounded-full mt-1.5 -start-1.5 border border-white"></div>
                    <time className="mb-1 text-xs font-normal leading-none text-gray-400">
                      {format(D_Docum_FecEnv, "DD/MM/YYYY")}
                    </time>
                    <h3 className="text-lg font-semibold text-primary">
                      {Documento}
                    </h3>
                    <p className="mb-4 text-xs font-normal text-primary ">
                      {T_Docum_AsuntoFull}
                    </p>
                  </li>
                )
              )}
          </ol>
        </div>
      )}
    </div>
  );
};

export default IncidentDocumPath;
