import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'flowbite';

import { AuthProvider } from '@auth/services/AuthContext';
import { RouterProvider } from 'react-router-dom';
import router from './routes/AppRoute';
import { Toaster } from 'sonner';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<AuthProvider>
			<RouterProvider router={router} />
		<Toaster richColors visibleToasts={9} position="bottom-right" />
		</AuthProvider>
	</StrictMode>,
);
