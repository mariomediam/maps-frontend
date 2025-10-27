import clousureTypeData from "@features/clousureType/data/clousureTypeData";

const ClousureTypeSelect = ({
  currentClousureTypeId,
  handleClousureTypeChange,
}) => {
  const isLoading = false;

  return (
    <div>
      <form className="">
        <label
          htmlFor="clousure_type_select"
          className="text-[12px] text-gray-500 pb-0 mb-0"
        >
          Resultado
        </label>
        <select
          id="clousure_type_select"
          value={currentClousureTypeId}
          onChange={(event) => handleClousureTypeChange(event.target.value)}
          // className="block py-1 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-primary appearance-none  focus:outline-none focus:ring-0 focus:border-gray-200 peer mt-0"
          className="w-full p-2.5 text-sm text-gray-900  rounded-lg border border-gray-300 focus:ring-primary focus:border-primary mb-3"
        >
          {isLoading ? (
            <option value="0">Cargando...</option>
          ) : (
            clousureTypeData.map(({ id_closure_type, description }) => (
              <option key={id_closure_type} value={id_closure_type}>
                {description}
              </option>
            ))
          )}
        </select>

      
      </form>
    </div>
  );
};

export default ClousureTypeSelect;
