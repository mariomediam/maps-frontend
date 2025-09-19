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
    </section>
  );
};

export default AddPhotography;
