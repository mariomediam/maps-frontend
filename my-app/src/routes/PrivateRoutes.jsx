import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import AuthContext from "../context/AuthContext";

export const PrivateRoutes = () => {
	const location = useLocation();
	const { tokenEsValido } = useContext(AuthContext);

	return tokenEsValido() ? (
		<Outlet />
	) : (
		<Navigate to="/login" replace state={{ from: location }} />
	);
};
