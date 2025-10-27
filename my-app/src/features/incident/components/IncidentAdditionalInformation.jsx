import React from "react";

const IncidentAdditionalInformation = ({ incident }) => {

const { priority_name} = incident;

  return (
    <div className="border border-primary mx-3 rounded-lg p-2">
      <p className="text-primary font-semibold text-sm">Información adicional</p>

      <p className="text-sm text-gray-500 mt-1">Escala de prioridad</p>
      <p className="">{priority_name}</p>
    </div>
  );
};

export default IncidentAdditionalInformation;
