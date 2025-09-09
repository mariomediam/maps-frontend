import Map2Icon from '@shared/assets/icons/Map2Icon';
import { useNavigate } from 'react-router-dom';

const SystemDashboardPage = () => {
	const navigate = useNavigate();

	return (
		<div className="flex justify-center items-center h-screen">
			<button
				type="button"
				className="text-secondary bg-primary hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 cursor-pointer"
				onClick={() => navigate('/map-explorer')}
			>
				<Map2Icon className="me-1" />
				Ver mapa interactivo
			</button>
		</div>
	);
};

export default SystemDashboardPage;
