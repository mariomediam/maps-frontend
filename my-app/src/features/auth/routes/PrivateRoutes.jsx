import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@auth/hooks/useAuth';

export const PrivateRoutes = () => {
	const location = useLocation();
	const { tokenEsValido } = useAuth();
	
	// Si el token es válido, mostrar la ruta privada
	if (tokenEsValido()) {
		return <Outlet />;
	}
	
	// Si el token no es válido, redirigir al login guardando la ruta de destino
	return <Navigate to="/login" replace state={{ from: location }} />;
};
