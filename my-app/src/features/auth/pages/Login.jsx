import { useState } from "react";
import { login } from "@auth/services/authApi";
import escudo from "@/shared/assets/images/escudo-mpp.webp";
import ExclamationCircle from "@/shared/assets/icons/ExclamationCircle";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError(false);
      const response = await login(username, password);
    } catch (error) {      
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-primary flex justify-center items-center h-screen p-5">
      <div className="border px-4 py-8 m-2 rounded-lg border-gray-300 flex flex-col items-center bg-white max-w-md w-full">
        <img src={escudo} alt="escudo" className="mt-5" />
        <h1 className="text-primary text-sm">
          Municipalidad Provincial de Piura
        </h1>
        <h1 className="text-primary text-2xl font-bold text-center">
          Sistema para el registro de incidencias
        </h1>
        <form onSubmit={handleLogin}>
          <div className="flex flex-col gap-2 pt-5">
            <label htmlFor="username" className="text-gray-500 text-sm">
              Usuario
            </label>
            <input
              type="text"
              id="username"
              className="border p-2 rounded-lg border-primary"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="password" className="text-gray-500 text-sm">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="border p-2 rounded-lg border-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="bg-primary text-secondary mt-2 p-2 rounded-lg"
              disabled={!username || !password || isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </div>
        </form>
        
        {/* Mensaje de error con altura fija para evitar saltos */}
        <div className="mt-2 h-12 flex items-center justify-center">
          {error && (
            <div className="flex items-center p-2 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
              <ExclamationCircle className="me-2" />
              <span className="sr-only">Info</span>
              <div>Usuario o contraseña incorrectos. Vuelva a intentarlo.</div>
            </div>
          )}
        </div>
        
      </div>
    </main>
  );
};

export default Login;
