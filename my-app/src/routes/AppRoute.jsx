import { PrivateRoutes, PublicRoutes } from "@auth";
import MapExplorerPage from "@features/mapExplorer/pages/MapExplorerPage";
import { ErrorPage } from "@shared";
import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Login from "@auth/pages/Login";
import ReportIncident from "@features/incident/pages/ReportIncident";

const router = createBrowserRouter([
  // Rutas públicas (solo accesibles si NO estás autenticado)
  {
    path: "/",
    element: <PublicRoutes />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "map-explorer",
        element: <MapExplorerPage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      
    ],
  },

  // Rutas privadas (solo accesibles si estás autenticado)
  {
    path: "/",
    element: <PrivateRoutes />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "add-incident",
        element: <ReportIncident />,
      },
      // {
      //   path: "admin",
      //   children: [
      //     {
      //       path: "main",
      //       element: <MapExplorerPage />,
      //     },
      //   ],
      // },
    ],
  },

  // Ruta catch-all para manejar 404s
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default router;
