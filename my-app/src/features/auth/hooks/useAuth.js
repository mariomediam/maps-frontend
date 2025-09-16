import { useContext } from 'react';
import AuthContext from '../services/AuthContext';
import { isAuthenticated, getStoredTokens, logout } from '../services/authApi';

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth debe ser usado dentro de un AuthProvider');
	}
	return context;
};

// Hook simple para verificar autenticación sin contexto
export const useAuthStatus = () => {
	const { tokenEsValido, logoutUser } = useAuth();
	const tokens = getStoredTokens();
	
	const handleLogout = () => {
		logoutUser();
		// Opcional: redirigir al login
		window.location.href = '/login';
	};
	
	return {
		isLoggedIn: tokenEsValido(),
		tokens,
		logout: handleLogout
	};
};
