

const AdminIncidentFilters = ({ filters, handleChange, handleSubmit, incidentStates, incidentCategories }) => {
  return (
    <div className="w-full border border-gray-300 rounded-lg p-3 mt-3">
          <form className="flex items-center mx-auto gap-2 flex-col md:flex-row" onSubmit={handleSubmit}>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 w-full"
              placeholder="Buscar por id, descripción o referencia"
              name="textSearch"
              value={filters.textSearch}
              onChange={handleChange}
            />

            <select
              id="incident_state_select"
              value={filters.idState}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 w-full md:w-1/3"
              name="idState"
            >
              {incidentStates.map(({ id_state, description }) => (
                <option key={id_state} value={id_state}>
                  {description}
                </option>
              ))}
            </select>

            <select
              id="incident_category_select"
              value={filters.idCategory}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full md:w-1/2 p-2.5"
              name="idCategory"
            >
              {incidentCategories.map(({ id_category, description }) => (
                <option key={id_category} value={id_category}>
                  {description}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="flex justify-center items-center py-2.5 px-3 text-sm font-medium text-white bg-primary rounded-lg border border-primary hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 cursor-pointer w-full md:w-1/6 mt-2 md:mt-0"              
            >
              <svg
                className="w-4 h-4 me-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              Buscar
            </button>
          </form>
        </div>
  )
}

export default AdminIncidentFilters