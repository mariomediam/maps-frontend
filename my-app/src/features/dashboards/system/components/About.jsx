import InfoCircleIcon from '@shared/assets/icons/InfoCircleIcon';

const About = () => {
  return (
    <>
      <article        
        className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm "
      >
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-primary flex items-center">
        <InfoCircleIcon className="me-1" /> Acerca del sistema
        </h5>
        <p className="font-normal text-primary">
        Este sistema permite a los ciudadanos reportar incidencias viales como obstáculos en las vías, roturas de tapas de buzones, asfalto en mal estado, señalización deficiente y otros problemas que afecten la seguridad y transitabilidad de nuestras calles. Su participación es fundamental para mantener una ciudad más segura y ordenada.
        </p>
      </article>
    </>
  );
}; 

export default About;
