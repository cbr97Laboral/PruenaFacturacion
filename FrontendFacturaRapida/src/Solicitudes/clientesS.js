import { getControlSolicitud } from "./baseSolicitud";
const API_BASE_Cliente = "Clientes";
export const getAllClientesActivo = async () => {
  return await getControlSolicitud(`${API_BASE_Cliente}/estado?activo=${true}`);
};

export const getAllClientesInactivo = async () => {
  return await getControlSolicitud(
    `${API_BASE_Cliente}/estado?activo=${false}`
  );
};

export const getAllClientes = async () => {
  return await getControlSolicitud(`${API_BASE_Cliente}`);
};
