import escudo from "@/shared/assets/images/escudo-mpp.png";
import { useAuth } from "@features/auth/hooks/useAuth";
import { useEffect } from "react";
import { initFlowbite, Popover } from "flowbite";

const MainHeader = () => {
  const { userName, tokenEsValido } = useAuth();

  // Inicializar Flowbite después de que el componente se monte
  useEffect(() => {
    // Inicializar Flowbite después de que el DOM esté listo
    const timer = setTimeout(() => {
      try {
        initFlowbite();
        console.log('Flowbite inicializado correctamente');
        
        // Inicializar manualmente el popover
        const popoverElement = document.getElementById('popover-user');
        const popoverTrigger = document.querySelector('[data-popover-target="popover-user"]');
        
        if (popoverElement && popoverTrigger) {
          const popover = new Popover(popoverElement, popoverTrigger, {
            placement: 'bottom',
            triggerType: 'click'
          });
          console.log('Popover de usuario inicializado manualmente');
        }
      } catch (error) {
        console.error('Error al inicializar Flowbite:', error);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Re-inicializar cuando cambie el estado de autenticación
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        initFlowbite();
        console.log('Flowbite re-inicializado');
      } catch (error) {
        console.error('Error al re-inicializar Flowbite:', error);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [tokenEsValido()]);

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
              {/* <p>tokenEsValido: {tokenEsValido() ? "true" : "false"}</p>
              <p>userName: {userName}</p> */}
            </div>
          </div>

          {!tokenEsValido() && (
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
          )}
          {/* TODO: Si el usuario está autenticado, mostrar el nombre del usuario, caso contrario mostrar el botón de iniciar sesión */}
          {/*  */}


          {tokenEsValido() ? (
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
                className="invisible absolute z-[9999] inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
              >
                <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Perfil de Usuario</h3>
                </div>
                <div className="px-3 py-2">
                  <p className="text-gray-700 dark:text-gray-300">Usuario: {userName}</p>
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                    <button 
                      onClick={() => {
                        // Aquí puedes agregar la lógica de logout
                        console.log('Logout clicked');
                      }}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>
                <div data-popper-arrow></div>
              </div>
            </div>
          ) : (
            <div
              className="hidden w-full md:block md:w-auto"
              id="navbar-default"
            >
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
          )}

          {/*  */}
        </div>
      </nav>
    </header>
  );
};

export default MainHeader;
