import { postControlSolicitud } from "./baseSolicitud";

const API_BASE_Users = "Users";
export const postLoginIn = async (username,password) => {
  return await postControlSolicitud(`${API_BASE_Users}/login`,{
    username,
    password,
  });
};
