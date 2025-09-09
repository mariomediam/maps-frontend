import { PrivateRoutes } from '@auth';
import MapExplorerPage from '@features/mapExplorer/pages/MapExplorerPage';
import { ErrorPage } from '@shared';
import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';

const router = createBrowserRouter([
	{
		path: '/admin',
		element: <PrivateRoutes />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: 'main',
				element: <MapExplorerPage />,
			},
		],
	},

	{
		path: '/',
		element: <App />,
		errorElement: <ErrorPage />,
	},
	{
		path: 'map-explorer',
		element: <MapExplorerPage />,
		errorElement: <MapExplorerPage />,
	},
	// Ruta catch-all para manejar 404s
	{
		path: '*',
		element: <ErrorPage />,
	},
]);

export default router;
