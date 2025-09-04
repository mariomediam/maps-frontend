import useAxios from "./useAxios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const URL = `${API_BASE_URL}/rrhh`;

const obtenerPlanillaBoleta = async (
  anio,
  mes,
  tipo = undefined,
  numero = undefined
) => {
  try {
    let api = useAxios();

    let URLPlanillas = `${URL}/lista-planilla-boleta?anio=${anio}&mes=${mes}`;

    if (tipo) {
      URLPlanillas += `&tipo=${tipo}`;
    }

    if (numero) {
      URLPlanillas += `&numero=${numero}`;
    }

    let {
      data: { content },
    } = await api.get(URLPlanillas);

    if (tipo && numero) {
      if (content.length === 0) {
        return {};
      }
      if (content.length === 1) {
        return content[0];
      }
    }

    return content;
  } catch (error) {
    throw error;
  }
};

const obtenerPlanillaDetalle = async (anio, mes, tipo, numero) => {
  try {
    let api = useAxios();

    let URLPlanilla = `${URL}/lista-planilla-detalle?anio=${anio}&mes=${mes}&tipo=${tipo}&numero=${numero}`;

    let {
      data: { content },
    } = await api.get(URLPlanilla);

    return content;
  } catch (error) {
    throw error;
  }
};

const generaBoletasPdf = async (anio, mes, tipo, numero) => {
  try {
    let api = useAxios();

    let credenciales = {
      anio,
      mes,
      tipo,
      numero,
    };

    let URLGeneraBoletas = `${URL}/genera-boletas/`;

    let {
      data: { message },
    } = await api.post(URLGeneraBoletas, credenciales);

    return message;
  } catch (error) {
    throw error;
  }
};

const obtenerPlanillaBoletasYaGeneradas = async (
  anio,
  mes,
  tipo = undefined,
  numero = undefined
) => {
  try {
    let api = useAxios();

    let URLPlanillas = `${URL}/lista-planilla-generado?anio=${anio}&mes=${mes}`;

    if (tipo) {
      URLPlanillas += `&tipo=${tipo}`;
    }

    if (numero) {
      URLPlanillas += `&numero=${numero}`;
    }

    let {
      data: { content },
    } = await api.get(URLPlanillas);

    if (tipo && numero) {
      if (content.length === 0) {
        return {};
      }
      if (content.length === 1) {
        return content[0];
      }
    }

    return content;
  } catch (error) {
    throw error;
  }
};

const obtenerTrabajadorCorreo = async (valor) => {
  try {
    let api = useAxios();

    let URLTrabajadorCorreo = `${URL}/lista-trabajador-correo?valor=${valor}`;

    let {
      data: { content },
    } = await api.get(URLTrabajadorCorreo);

    return content;
  } catch (error) {
    throw error;
  }
};

const actualizarTrabajadorCorreo = async (dni, correo) => {
  try {
    let api = useAxios();

    let credenciales = {
      dni,
      correo,
    };

    let URLUpdateTrabajadorCorreo = `${URL}/update-trabajador-correo/`;

    let {
      data: { message },
    } = await api.post(URLUpdateTrabajadorCorreo, credenciales);

    return message;
  } catch (error) {
    throw error;
  }
};

const eliminarTrabajadorCorreo = async (dni) => {
  try {
    let api = useAxios();

    // Corregido el error de la URL (había doble })
    let URLDeleteTrabajadorCorreo = `${URL}/delete-trabajador-correo/${dni}`;

    let {
      data: { message },
    } = await api.delete(URLDeleteTrabajadorCorreo);

    return message;
  } catch (error) {
    throw error;
  }
};

export {
  obtenerPlanillaBoleta,
  obtenerPlanillaDetalle,
  generaBoletasPdf,
  obtenerPlanillaBoletasYaGeneradas,
  obtenerTrabajadorCorreo,
  actualizarTrabajadorCorreo,
  eliminarTrabajadorCorreo,
};
