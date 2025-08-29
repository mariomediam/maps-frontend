import { PrivateRoutes } from "@auth";
import { MapList } from "@maps";
import { ErrorPage } from "@shared";
import { createBrowserRouter } from "react-router-dom";
import App from "@/App";

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
