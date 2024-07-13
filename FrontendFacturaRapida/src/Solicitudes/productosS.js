import { getControlSolicitud } from "./baseSolicitud";

export const getAllProductsActivo = async () => {
  return await getControlSolicitud(`productos/estado?activo=${true}`);
};

export const getAllProductsInactivo = async () => {
  return await getControlSolicitud(`productos/estado?activo=${false}`);
};

export const getAllProducts = async () => {
  return await getControlSolicitud(`productos`);
};
