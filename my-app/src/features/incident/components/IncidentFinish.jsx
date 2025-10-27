import React from 'react'

const IncidentFinish = ({ incident }) => {

    const { closure_type_name, closure_description } = incident;


  return (
    <>
      <p className="text-primary font-semibold text-sm">Detalles de la atención</p>

      <p className="text-sm text-gray-500 mt-1">Resultado</p>
      <p className="">{closure_type_name}</p>

       <p className="text-sm text-gray-500 mt-2">Descripción</p>
      <p className="">{closure_description}</p>
    </>
  )
}

export default IncidentFinish