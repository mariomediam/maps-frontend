import IncidentPhotography from '@/features/incident/components/IncidentPhotography';
import { format } from '@formkit/tempo';
import useIncidentsStore from '@/features/incident/store/incidentStore.js';

const IncidentCardItem = ({ incident, className }) => {

	const { summary, id_incident, registration_date, category_name, photographs } = incident;

	const firstPhotography = photographs[0];

	const idPhotography = firstPhotography?.id_photography;

	const setIncidentSelectedFromStore = useIncidentsStore((state) => state.setIncidentSelectedFromStore);

	return (
		<article className={`bg-gray-500  ${className}`} onClick={() => setIncidentSelectedFromStore(id_incident)}>
			<a
				href="#"
				className="flex flex-col items-start bg-secondary border-t border-gray-300 pt-1 shadow-sm md:flex-row md:max-w-xl hover:bg-header-500 "
			>
				{/* <img
          className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
          src="/docs/images/blog/image-4.jpg"
          alt={summary}
        /> */}
        
				<div className="flex justify-between  w-full gap-1 p-1">
					<div className="flex flex-col justify-between leading-normal">
						<p className="mb-2tracking-tight text-primary text-sm">
							{summary}
						</p>
						<p className="mb-3  text-xs text-gray-500 ">
							{format(registration_date, 'DD/MM/YYYY HH:mm')}
						</p>
					</div>
        
					<div className="flex justify-end ">
						<IncidentPhotography idPhotography={idPhotography} />
					</div>
        

				</div>
        
			</a>
		</article>
	);
};

export default IncidentCardItem;
