import escudo from "@/shared/assets/images/escudo-mpp.png";

import "flowbite";

const MainHeader = () => {
  return (
    <header className="bg-header">
      <nav>
        <div className="flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="flex gap-2 ">
            <div className="flex items-center">
              <img
                src={escudo}
                alt="Escudo Municipalidad Provincial de Piura"
                className="w-8"
              />
            </div>
            <div className="flex flex-col gap-1 md:gap-0">
              <h1 className="text-secondary text-1xl tracking-tight lg:text-2xl font-bold pb-0 mb-0 leading-[1.1]">
                Sistema para el registro de incidencias
              </h1>
              <p className="text-secondary text-sm text-[12px]  lg:text-sm leading-tight">
                Municipalidad Provincial de Piura
              </p>
            </div>
          </div>

          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-secondary rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border-secondary rounded-lg :flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 border  ">
              <li>
                <a
                  href="/login"
                  className="block py-2 px-3 text-secondary hover:bg-primary rounded-lg md:border-0 cursor-pointer transition-colors duration-200"
                >
                  Iniciar sesión
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default MainHeader;
