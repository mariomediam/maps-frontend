import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@auth/services/authApi';

export const PrivateRoutes = () => {
	const location = useLocation();
	
	// Si está autenticado, mostrar la ruta privada
	if (isAuthenticated()) {
		return <Outlet />;
	}
	
	// Si no está autenticado, redirigir al login guardando la ruta de destino
	return <Navigate to="/login" replace state={{ from: location }} />;
};
