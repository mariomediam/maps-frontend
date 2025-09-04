import { diffMilliseconds } from "@formkit/tempo";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
	console.error(
		"VITE_API_BASE_URL no está definida en las variables de entorno",
	);
	throw new Error("VITE_API_BASE_URL no está definida");
}

const TOKEN_KEY = "mapsTokens";

const useAxios = () => {
	// Obtener tokens del localStorage
	const storedTokens = localStorage.getItem(TOKEN_KEY);

	// Crear instancia base de axios
	const axiosInstance = axios.create({
		baseURL: API_BASE_URL,
		headers: {
			"Content-Type": "application/json",
		},
	});

	// Si no hay tokens, retornar instancia sin autenticación
	if (!storedTokens) {
		return axiosInstance;
	}

	let authTokens = JSON.parse(storedTokens);

	// Agregar header de autorización si hay tokens
	axiosInstance.defaults.headers.Authorization = `Bearer ${authTokens?.access}`;

	// Interceptor para manejar el refresh del token
	axiosInstance.interceptors.request.use(async (req) => {
		// Solo procesar si hay token en el header
		if (!req.headers.Authorization) {
			return req;
		}

		try {
			// Decodificar el token para verificar expiración
			const authTokensDecode = jwtDecode(authTokens.access);

			// Verificar si el token ha expirado
			const expirationDate = new Date(authTokensDecode.exp * 1000);
			const now = new Date();
			const timeDifference =
				diffMilliseconds(expirationDate, now) - (authTokens.diffTime || 0);
			const isExpired = timeDifference < 1000; // 1 segundo de margen

			if (!isExpired) {
				return req;
			}

			// Refrescar el token
			const response = await axios.post(
				`${API_BASE_URL}/seguridad/refresh-session`,
				{
					refresh: authTokens.refresh,
				},
			);

			// Actualizar tokens
			response.data["refresh"] = authTokens.refresh;
			response.data["diffTime"] = authTokens.diffTime;

			localStorage.setItem(TOKEN_KEY, JSON.stringify(response.data));
			authTokens = response.data;

			// Actualizar el header de autorización
			req.headers.Authorization = `Bearer ${response.data.access}`;

			return req;
		} catch (error) {
			// Si falla el refresh, limpiar tokens
			localStorage.removeItem(TOKEN_KEY);
			console.error("Error al refrescar token:", error);

			// Remover header de autorización para esta request
			delete req.headers.Authorization;

			return req;
		}
	});

	// Interceptor para manejar errores de respuesta
	axiosInstance.interceptors.response.use(
		(response) => response,
		(error) => {
			if (error.response?.status === 401) {
				// Token inválido, limpiar storage
				localStorage.removeItem(TOKEN_KEY);
				console.error("Error de autenticación:", error);
			}
			return Promise.reject(error);
		},
	);

	return axiosInstance;
};

export default useAxios;
