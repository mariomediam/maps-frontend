import LocationPinIcon from "@/shared/assets/icons/LocationPinIcon";

const SelectUbication = () => {
  return (
    <section className="flex flex-col items-center justify-center">
      <p className="font-bold text-lg text-primary">Ubicación</p>
      <div className="flex flex-col md:flex-row items-center justify-center">
        <p className="text-sm text-primary me-2 mb-1">
          <span className="me-2 mb-1">Haz doble clic en el mapa y arrastra el pin al lugar exacto, o</span>
          <button
            type="button"
            className="text-primary hover:text-secondary border border-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary  rounded-lg text-sm px-3 py-1.5 text-center me-2 mb-2 cursor-pointer"
          >
            <div className="flex gap-2 items-center">
              <LocationPinIcon /> <span> usa mi ubicación actual </span>
            </div>
          </button>
        </p>
      </div>
    </section>
  );
};

export default SelectUbication;
