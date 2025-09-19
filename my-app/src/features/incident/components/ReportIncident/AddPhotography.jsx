import LoadPhotography from "@shared/components/LoadPhotography";

const AddPhotography = () => {

  return (
    <section className="flex flex-col items-center justify-center">
      <p className="font-bold text-lg text-primary">Fotografías <span className="text-sm text-gray-500">(opcional)</span></p>
      <p className="text-sm text-gray-500">
        Para obtener mejores resultados, incluya un primer plano y un plano
        general.
      </p>
      <LoadPhotography />

      {/* Consejos */}
      <div className="mt-0 text-sm text-gray-600">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-green-600 font-bold">✓</span>
          <span>Los reportes con fotos tienden a resolverse más rápidamente</span>
        </div>
        <div className="flex items-start gap-2 mb-2">
          <span className="text-green-600 font-bold">✓</span>
          <span>Para mejores resultados incluye una toma cercana y una amplia</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-red-600 font-bold">×</span>
          <span>Evita información personal y placas de vehículos</span>
        </div>
      </div>
    </section>
  );
};

export default AddPhotography;
