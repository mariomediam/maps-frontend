import React from "react";

const IncidentAdditionalInformation = ({ incident }) => {

const { priority_name} = incident;

  return (
    <>
      <p className="text-primary font-semibold text-sm">Información adicional</p>

      <p className="text-sm text-gray-500 mt-1">Escala de prioridad</p>
      <p className="">{priority_name}</p>
    </>
  );
};

export default IncidentAdditionalInformation;
