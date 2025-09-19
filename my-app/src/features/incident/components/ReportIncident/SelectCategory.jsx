
import useIncidentsStore from "@features/incident/store/incidentStore";


const SelectCategory = ({categories, isLoading}) => {
  const incidentAdded = useIncidentsStore((state) => state.incidentAdded);
  const setIncidentAdded = useIncidentsStore((state) => state.setIncidentAdded);
  

 

  const handleCategoryChange = (event) => {
    const selectedCategoryId = parseInt(event.target.value);
    console.log("selectedCategoryId", selectedCategoryId);
    setIncidentAdded({ category_id: selectedCategoryId });
  };

  return (
    <section className="flex flex-col items-center justify-center">
      <p className="font-bold text-lg text-primary">Categoría</p>
      <p className="text-sm text-gray-500">
        ¿Qué desea denunciar? Elija de la lista a continuación:
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center h-full mt-4">
          <div className="animate-spin rounded-full h-2 w-2 border-b-1 border-primary"></div>
        </div>
      ) : (
         <ul className="text-sm font-medium text-primary bg-white border border-gray-200 rounded-lg mt-3 ">
          {categories.map(({ description, id_category }) => (
            <li
              className="px-4 w-full border-b border-gray-200 rounded-t-lg "
              key={id_category}
            >
              <div className="flex items-center ps-3">
                 <input
                   id={`list-radio-${id_category}`}
                   type="radio"
                   value={id_category}
                   name="list-radio"
                   className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
                   checked={incidentAdded?.category_id === id_category}
                   onChange={handleCategoryChange}
                 />
                <label
                  htmlFor={`list-radio-${id_category}`}
                  className="w-full py-3 ms-2 text-sm font-medium text-gray-900 "
                >
                  {description}
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default SelectCategory;
