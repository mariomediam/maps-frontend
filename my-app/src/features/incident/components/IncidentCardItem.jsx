import IncidentPhotography from "@/features/incident/components/IncidentPhotography";

const IncidentCardItem = ({ incident, className }) => {

  const { summary, id_incident, registration_date, category_name, photographs } = incident;

  const firstPhotography = photographs[0];

  const idPhotography = firstPhotography?.id_photography;

  return (
    <article className={`bg-secondary  ${className}`}>
      <a
        href="#"
        className="flex flex-col items-start bg-secondary border-t border-gray-300 pt-1 shadow-sm md:flex-row md:max-w-xl hover:bg-header-500 "
      >
        {/* <img
          className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
          src="/docs/images/blog/image-4.jpg"
          alt={summary}
        /> */}
        
        <div className="flex flex-col justify-between leading-normal">
          <p className="mb-2 tracking-tight text-primary text-sm">
            {summary}
          </p>
          <p className="mb-3 text-xs text-gray-500 ">
            {registration_date}
          </p>
        </div>
        
        <IncidentPhotography idPhotography={idPhotography} />
        
      </a>
    </article>
  );
};

export default IncidentCardItem;
