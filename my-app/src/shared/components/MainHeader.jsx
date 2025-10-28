import escudo from "@/shared/assets/images/escudo-mpp.png";
import { useAuth } from "@features/auth/hooks/useAuth";
import { useEffect } from "react";
import { initFlowbite, Popover } from "flowbite";
import { useNavigate } from "react-router-dom";
import useIncidentsStore from "@features/incident/store/incidentStore";
import useWindowStore from "@shared/store/windowStore";
import { useBreakpointInit } from "@features/mapExplorer/hooks/useBreakpointInit";

const MainHeader = () => {

  useBreakpointInit();
  const { userName, tokenEsValido, logoutUser } = useAuth();
  const navigate = useNavigate();
  const setSelectedIncident = useIncidentsStore(
    (state) => state.setSelectedIncident
  );
  const selectedIncident = useIncidentsStore((state) => state.selectedIncident);
  const isMobile = useWindowStore((state) => state.isMobile);

  const onClicToggleIncidentSelected = () => {
    if (selectedIncident) {
      console.log("aaaa");
      setSelectedIncident(null);
    } else {
      console.log("bbbb");
      setSelectedIncident({ id: 1234 });
    }
  };

  // Inicializar Flowbite después de que el componente se monte
  useEffect(() => {
    // Inicializar Flowbite después de que el DOM esté listo
    const timer = setTimeout(() => {
      try {
        initFlowbite();
        console.log("Flowbite inicializado correctamente");

        // Inicializar manualmente el popover
        const popoverElement = document.getElementById("popover-user");
        const popoverTrigger = document.querySelector(
          '[data-popover-target="popover-user"]'
        );

        if (popoverElement && popoverTrigger) {
          const popover = new Popover(popoverElement, popoverTrigger, {
            placement: "bottom",
            triggerType: "click",
          });
          console.log("Popover de usuario inicializado manualmente");
        }
      } catch (error) {
        console.error("Error al inicializar Flowbite:", error);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Re-inicializar cuando cambie el estado de autenticación
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        initFlowbite();
        console.log("Flowbite re-inicializado");
      } catch (error) {
        console.error("Error al re-inicializar Flowbite:", error);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [tokenEsValido()]);

  const handleLogout = () => {
    logoutUser();
    window.location.href = "/map-explorer";
  };

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

          {isMobile && (
            <>
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
              <div
                className="hidden w-full md:block md:w-auto"
                id="navbar-default"
              >
                <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border-secondary rounded-lg :flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 border  ">
                  <li>
                    <a
                      href="/"
                      className="block py-2 px-3 text-secondary hover:bg-primary rounded-lg md:border-0 cursor-pointer transition-colors duration-200"
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      href="/map-explorer"
                      className="block py-2 px-3 text-secondary hover:bg-primary rounded-lg md:border-0 cursor-pointer transition-colors duration-200"
                    >
                      Mapa
                    </a>
                  </li>
                  {tokenEsValido() ? (
                    <>
                      <li>
                        <a
                          href="/admin-incident"
                          className="block py-2 px-3 text-secondary hover:bg-primary rounded-lg md:border-0 cursor-pointer transition-colors duration-200"
                        >
                          Administrar incidencias
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          onClick={handleLogout}
                          className="block py-2 px-3 text-secondary hover:bg-primary rounded-lg md:border-0 cursor-pointer transition-colors duration-200"
                        >
                          Cerrar sesión{" "}
                          <span className="text-sm">
                            {userName.toUpperCase()}
                          </span>
                        </a>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <a
                          href="/login"
                          className="block py-2 px-3 text-secondary hover:bg-primary rounded-lg md:border-0 cursor-pointer transition-colors duration-200"
                        >
                          Iniciar sesión
                        </a>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </>
          )}

          {!isMobile && (
            <>
              <div
                id="mega-menu"
                className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
              >
                <ul className="flex flex-col mt-4 font-medium md:flex-row md:mt-0 md:space-x-8 rtl:space-x-reverse items-center">
                  <li>
                    <a
                      href="/"
                      className="block py-2 px-3 text-secondary border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0 "
                      aria-current="page"
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      href="/map-explorer"
                      className="block py-2 px-3 text-secondary border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0 "
                      aria-current="page"
                    >
                      Mapa
                    </a>
                  </li>
                  {tokenEsValido() ? (
                    <>
                      <li>
                        <a
                          href="/admin-incident"
                          className="block py-2 px-3 text-secondary border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0 "
                          aria-current="page"
                        >
                          Administrar
                        </a>
                      </li>
                      <li>
                        <div className="relative z-[9999]">
                          <div
                            data-popover-target="popover-user"
                            data-popover-placement="bottom"
                            className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-primary rounded-full cursor-pointer hover:bg-opacity-80 transition-all duration-200"
                          >
                            <span className="font-medium text-secondary">
                              {userName.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div
                            data-popover
                            id="popover-user"
                            role="tooltip"
                            className="invisible absolute z-[9999] inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-secondary border border-gray-200 rounded-lg shadow-sm opacity-0 "
                          >
                            <div className="px-3 py-2 bg-secondary border-b border-gray-200 rounded-t-lg ">
                              <h3 className="font-semibold text-primary">
                                Perfil de Usuario
                              </h3>
                            </div>
                            <div className="px-3 py-2 w-full">
                              <p className="text-gray-700">
                                Usuario: {userName.toUpperCase()}
                              </p>
                              <div className="mt-2 p-0  border-gray-200 w-full ">
                                <button
                                  type="button"
                                  className="text-white bg-primary hover:bg-black focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 m-0 focus:outline-none w-full rounded-lg cursor-pointer hover:font-bold"
                                  onClick={handleLogout}
                                >
                                  Cerrar sesión
                                </button>
                              </div>
                            </div>
                            <div data-popper-arrow></div>
                          </div>
                        </div>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <a
                          href="/login"
                          className="block py-2 px-3 text-secondary border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0 "
                          aria-current="page"
                        >
                          Iniciar sesión
                        </a>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default MainHeader;
