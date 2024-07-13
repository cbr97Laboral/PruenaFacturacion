import axios from "axios";
import { mostrarError } from "../UtilidadesJS/ModalesInformativos/swalConfig";

const API_BASE_URL = "api/";

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