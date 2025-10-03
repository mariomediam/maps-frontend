import FilterIcon from "@/shared/assets/icons/FilterIcon.jsx";

const MapShowSideBar = ({ showSideBar, setShowSideBar }) => {
  const onClickButtonToggle = () => {
    setShowSideBar(!showSideBar);
  };
  return (
    <div className="flex">
      <button
        type="button"
        className="flex-auto text-white bg-primary hover:bg-dark focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 focus:outline-none "
        onClick={onClickButtonToggle}
      >
         <div className="flex justify-center items-center gap-1">
                      <FilterIcon /> Mostrar filtros
                    </div>
      </button>
    </div>
  );
};

export default MapShowSideBar;
