import { diffMilliseconds } from '@formkit/tempo';
import { jwtDecode } from 'jwt-decode';
import { createContext, useCallback, useMemo, useState } from 'react';

const AuthContext = createContext();

// Constantes
const TOKEN_KEY = 'mapsTokens';

// Funciones auxiliares
const getStoredTokens = () => {
	try {
		const tokens = localStorage.getItem(TOKEN_KEY);
		return tokens ? JSON.parse(tokens) : null;
	} catch (error) {
		console.error('Error al parsear tokens del localStorage:', error);
		return null;
	}
};

const decodeToken = (token) => {
	try {
		return jwtDecode(token);
	} catch (error) {
		console.error('Error al decodificar token:', error);
		return null;
	}
};

export const AuthProvider = ({ children }) => {
	// Estados inicializados de forma más eficiente
	const [authTokens, setAuthTokens] = useState(() => getStoredTokens());

	const [user, setUser] = useState(() => {
		const tokens = getStoredTokens();
		return tokens ? decodeToken(tokens.access) : null;
	});

	const [userName, setUserName] = useState(() => {
		const tokens = getStoredTokens();
		if (tokens) {
			const decoded = decodeToken(tokens.access);
			return decoded?.user_id?.trim() || '';
		}
		return '';
	});

	const [loading, setLoading] = useState(false);

	// Función de login optimizada
	const setAuthContextLogin = useCallback((pUserName, pAuthTokens, pUser) => {
		const trimmedUserName = pUserName?.trim() || '';
		setUserName(trimmedUserName);
		setAuthTokens(pAuthTokens);
		setUser(pUser);

		// Guardar en localStorage
		if (pAuthTokens) {
			localStorage.setItem(TOKEN_KEY, JSON.stringify(pAuthTokens));
		}
	}, []);

	// Validación de token optimizada
	const tokenEsValido = useCallback(() => {
		const tokens = getStoredTokens();
		if (!tokens?.access) return false;

		const decoded = decodeToken(tokens.access);
		if (!decoded?.exp) return false;

		// Convertir timestamp Unix a Date y comparar con ahora
		const expirationDate = new Date(decoded.exp * 1000);
		const now = new Date();
		const timeDifference =
			diffMilliseconds(expirationDate, now) - (tokens.diffTime || 0);

		return timeDifference > 1;
	}, []);

	// Función de logout optimizada
	const logoutUser = useCallback(() => {
		setAuthTokens(null);
		setUser(null);
		setUserName('');
		localStorage.removeItem(TOKEN_KEY);
	}, []);

	// Memoizar el valor del contexto para evitar re-renders innecesarios
	const contextValue = useMemo(
		() => ({
			userName,
			setUserName,
			authTokens,
			setAuthTokens,
			user,
			setUser,
			loading,
			setLoading,
			tokenEsValido,
			logoutUser,
			setAuthContextLogin,
		}),
		[
			userName,
			authTokens,
			user,
			loading,
			tokenEsValido,
			logoutUser,
			setAuthContextLogin,
		],
	);

	return (
		<AuthContext.Provider value={contextValue}>
			{loading ? null : children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
