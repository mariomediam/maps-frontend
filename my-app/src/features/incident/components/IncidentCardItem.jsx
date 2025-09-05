const IncidentCardItem = ({ incident }) => {

  const { summary, id_incident, registration_date, category_name, photographs } = incident;
  return (
    <article className="bg-secondary py-2">
      <a
        href="#"
        className="flex flex-col items-center bg-secondary border border-gray-200 rounded-lg shadow-sm md:flex-row md:max-w-xl hover:bg-header-500 "
      >
        {/* <img
          className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
          src="/docs/images/blog/image-4.jpg"
          alt={summary}
        /> */}
        <div className="flex flex-col justify-between p-2 leading-normal">
          <p className="mb-2 tracking-tight text-primary text-sm">
            {summary}
          </p>
          <p className="mb-3 text-xs text-gray-500 ">
            {registration_date}
          </p>
        </div>
      </a>
    </article>
  );
};

export default IncidentCardItem;
