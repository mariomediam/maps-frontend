import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '@auth/services/authApi';

export const PublicRoutes = () => {
	// Si ya está autenticado, redirigir al map-explorer
	// if (isAuthenticated()) {
	// 	return <Navigate to="/map-explorer" replace />;
	// }
	
	// Si no está autenticado, mostrar la ruta pública
	return <Outlet />;
};
