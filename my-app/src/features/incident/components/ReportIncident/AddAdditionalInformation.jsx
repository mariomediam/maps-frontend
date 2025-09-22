import useIncidentsStore from "@features/incident/store/incidentStore";

const AddAdditionalInformation = () => {
  const incidentAdded = useIncidentsStore((state) => state.incidentAdded);
  const setIncidentAdded = useIncidentsStore((state) => state.setIncidentAdded);
  const isLoading = useIncidentsStore((state) => state.isLoading);

  const handleSummaryChange = (event) => {
    setIncidentAdded({ summary: event.target.value });
  };

  const handleReferenceChange = (event) => {
    setIncidentAdded({ reference: event.target.value });
  };

  return (
    <section className="flex flex-col items-center justify-center">
      <p className="font-bold text-lg text-primary">Provee más información</p>
      <p className="text-sm text-primary">
        Esta información se publicará en línea para que otros la puedan
        consultar
      </p>
      <div className="w-full mt-4">
        <label
          htmlFor="summary"
          className="block mb-1 text-sm font-medium text-primary"
        >
          Resumen de la Incidencia
        </label>
        <textarea
          id="summary"
          rows="4"
          className="block p-2.5 w-full text-sm text-gray-900  rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
          value={incidentAdded?.summary || ""}
          onChange={handleSummaryChange}
          disabled={isLoading}
        ></textarea>
        <ul className="text-xs text-gray-500 mt-1">
          <li>Exprésate con respeto y amabilidad</li>
          <li>Menciona desde cuándo sucede la situación</li>
          <li>Evita mencionar nombres o hacer acusaciones directas</li>
          <li>Evita incluir información personal</li>
        </ul>

        <label
          htmlFor="reference"
          className="block mb-1 text-sm font-medium text-primary mt-4"
        >
          Referencia
        </label>

        <input
          type="text"
          id="reference"
          className=" border border-gray-300 text-primary text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 "
          value={incidentAdded?.reference || ""}
          onChange={handleReferenceChange}
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Ejemplo: Cerca del parque principal, entre la Av. Grau y la calle
          Libertad, al costado de la tienda Mi Farma.
        </p>
      </div>
    </section>
  );
};

export default AddAdditionalInformation;
