import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import MapList from "../maps/MapList";
import { PrivateRoutes } from "../routes/PrivateRoutes";
import ErrorPage from "./error-page";

const router = createBrowserRouter([
	{
		path: "/",
		element: <PrivateRoutes />,
		children: [
			{
				path: "main",
				element: <MapList />,
			},
		],
	},

	{
		path: "maps",
		element: <MapList />,
		errorElement: <ErrorPage />,
	},
	{
		path: "test",
		element: <App />,
		errorElement: <ErrorPage />,
	},
]);

export default router;
