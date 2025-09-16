import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@auth/hooks/useAuth';

export const PublicRoutes = () => {
	const { tokenEsValido } = useAuth();
	
	// Si el token es válido y trata de entrar a login, redirigir al map-explorer
	if (tokenEsValido() && window.location.pathname === "/login") {
		return <Navigate to="/map-explorer" replace />;
	}
	
	// Si el token no es válido, mostrar la ruta pública
	return <Outlet />;
};
