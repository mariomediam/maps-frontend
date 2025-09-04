import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "flowbite";

import { AuthProvider } from "@auth/services/AuthContext";
import { RouterProvider } from "react-router-dom";
import router from "./routes/AppRoute";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	</StrictMode>,
);
