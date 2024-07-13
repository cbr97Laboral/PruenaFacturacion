import axios from "axios";
import { mostrarError, mostrarNotificacionWarning } from "../UtilidadesJS/ModalesInformativos/swalConfig";

const API_BASE_URL = "api/";
const MensajeErrorInterno = "Por favor, contacte al soporte para asistencia.";

export const getControlSolicitud = async (endpoint) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`);
    const { data } = response;

    if (data != null || data != "" || data != [] || data.length > 0) {
      return data;
    }
  } catch (error) {
    mostrarError();
    return null;
  }
};

export const postControlSolicitud = async (endpoint, body) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, body);
    const { data } = response;

    if (data != null || data != "" || data != [] || data.length > 0) {
      return data;
    }
  } catch (error) {
    const {data} = error.response;
    if (data) {
      mostrarNotificacionWarning(data.message, MensajeErrorInterno);
    }else{
    mostrarError();
    }
    return null;
  }
};
