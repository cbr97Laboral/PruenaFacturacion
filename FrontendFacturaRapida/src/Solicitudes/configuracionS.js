import { getControlSolicitud } from "./baseSolicitud";
const API_BASE_Configuracion = "ConfiguracionContexto";
export const getConfiguracionIntentoLogin = async () => {
  return await getControlSolicitud(`${API_BASE_Configuracion}/intentosLogin/1`);
};
