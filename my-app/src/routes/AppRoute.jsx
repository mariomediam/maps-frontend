import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import MapList from "../maps/MapList";
import { PrivateRoutes } from "../routes/PrivateRoutes";
import ErrorPage from "./error-page";

const router = createBrowserRouter([
	{
		path: "/admin",
		element: <PrivateRoutes />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "main",
				element: <MapList />,
			},
		],
	},
	
	{
		path: "/",
		element: <App />,
		errorElement: <ErrorPage />,
	},
	{
		path: "maps",
		element: <MapList />,
		errorElement: <ErrorPage />,
	},
	// Ruta catch-all para manejar 404s
	{
		path: "*",
		element: <ErrorPage />,
	},
]);

export default router;
