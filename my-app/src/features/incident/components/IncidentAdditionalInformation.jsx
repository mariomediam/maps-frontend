
import IncidentDocumPath from "./IncidentDocumPath";

const IncidentAdditionalInformation = ({ incident }) => {

const { priority_name} = incident;

  return (
    <>
      <p className="text-primary font-semibold text-sm">Información adicional</p>

      <p className="text-sm text-gray-500 mt-1">Escala de prioridad</p>
      <p className="mb-3">{priority_name}</p>
      <IncidentDocumPath c_docum={incident.derivation_document} />
    </>
  );
};

export default IncidentAdditionalInformation;
