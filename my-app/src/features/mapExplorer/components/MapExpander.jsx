import ArrowsMinimizeIcon from "@/shared/assets/icons/ArrowsMinimizeIcon.jsx";
import ArrowsMaximizeIcon from "@/shared/assets/icons/ArrowsMaximizeIcon.jsx";

const MapExpander = ({ expandMap, setExpandMap }) => {
  const onClickButtonToggle = () => {
    setExpandMap(!expandMap);
  };

  return (
    <div className="flex">
      {" "}
      <button
        type="button"
        className="flex-auto text-white bg-primary hover:bg-dark focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 focus:outline-none "
        onClick={onClickButtonToggle}
      >
        <div className="flex items-center justify-center gap-1">
          {expandMap ? (
            <>
              <ArrowsMinimizeIcon /> <span>Contraer mapa</span>
            </>
          ) : (
            <>
              <ArrowsMaximizeIcon /> <span>Expandir mapa</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
};

export default MapExpander;
