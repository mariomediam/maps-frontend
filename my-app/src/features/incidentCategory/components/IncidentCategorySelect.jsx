import { useState, useEffect } from "react";
import { getIncidentCategories } from "@features/incidentCategory/services/incidentCategoryApi";

const IncidentCategorySelect = ({className = ""}) => {
  const [incidentCategories, setIncidentCategories] = useState([{ id_category: 0, description: "Cargando..." }]);

  useEffect(() => {
    const fetchIncidentCategories = async () => {
      let categories = await getIncidentCategories();
      categories.unshift({ id_category: 0, description: "Todos" });
      setIncidentCategories(categories);
    };
    fetchIncidentCategories();
  }, []);

  return (
    <div className={className}>
      <form className="max-w-sm mx-auto">
        <label htmlFor="incident_category_select" className="text-[12px] text-gray-500 pb-0 mb-0">
          Categoría
        </label>
        <select
          id="incident_category_select"
          className="block py-1 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-primary appearance-none  focus:outline-none focus:ring-0 focus:border-gray-200 peer mt-0"
        >
          {incidentCategories.map(({ id_category, description }) => (
            <option key={id_category} value={id_category}>
              {description}
            </option>
          ))}
        </select>
      </form>
    </div>
  );
};

export default IncidentCategorySelect;
