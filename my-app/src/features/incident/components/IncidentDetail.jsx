export const IncidentDetail = ({
  isMobile,
  setSelectedIncident,
  setExpandMap,
}) => {
  const onClickCloseButton = () => {
    setExpandMap(false);
    setSelectedIncident(null);
  };

  return (
    <div className="flex justify-between">
      <p>Detalle del incidente</p>

      {isMobile && (
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none "
          onClick={onClickCloseButton}
        >
          X
        </button>
      )}
    </div>
  );
};
