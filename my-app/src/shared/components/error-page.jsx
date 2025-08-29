import { useRouteError, Link } from "react-router-dom";

export default function ErrorPage() {
	const error = useRouteError();
	console.error(error);

	const is404 = error?.status === 404;

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
			<div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
				<div className="mb-6">
					<div className="text-6xl mb-4">
						{is404 ? "🗺️" : "⚠️"}
					</div>
					<h1 className="text-3xl font-bold text-gray-800 mb-2">
						{is404 ? "Página no encontrada" : "¡Oops! Algo salió mal"}
					</h1>
					<p className="text-gray-600 mb-4">
						{is404 
							? "La página que buscas no existe o ha sido movida."
							: "Ha ocurrido un error inesperado."
						}
					</p>
					{error && (
						<div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
							<p className="text-sm text-red-600">
								<strong>Error:</strong> {error.status} - {error.statusText || error.message}
							</p>
						</div>
					)}
				</div>
				
				<div className="space-y-3">
					<Link 
						to="/maps" 
						className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
					>
						Ir al inicio
					</Link>
					<button 
						onClick={() => window.history.back()} 
						className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
					>
						Volver atrás
					</button>
				</div>
				
				{is404 && (
					<div className="mt-6 text-sm text-gray-500">
						<p>Si crees que esto es un error, por favor contacta al administrador.</p>
					</div>
				)}
			</div>
		</div>
	);
}
