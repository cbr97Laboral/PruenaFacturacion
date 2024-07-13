import { getConfiguracionIntentoLogin } from "../../Solicitudes/configuracionS";
import { mostrarNotificacionWarning } from "../../UtilidadesJS/ModalesInformativos/swalConfig";
import { postLoginIn } from "../../Solicitudes/loginS";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../Inputs/InputField";
import "./LoginForm.css";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  let intentosPermitidos = 0;
  let contadorIntentos = 0;
  let temporalUsername = "";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/App");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (intentosPermitidos == 0) {
      intentosPermitidos = await getConfiguracionIntentoLogin();
    }

    if (temporalUsername != username) {
      contadorIntentos = 0;
      temporalUsername = username;
    }

    if (contadorIntentos >= intentosPermitidos) {
      mostrarNotificacionWarning(
        "Credenciales incorrectas o cuenta bloqueada.",
        "Por favor, contacte al soporte para asistencia."
      );
      return;
    }

    let result = await postLoginIn(username, password);

    if (result == null) {
      contadorIntentos++;
      return;
    }

    const { token } = result;

    localStorage.setItem("token", token);
    navigate("/App");
  };

  return (
    <div className="contenedor-login">
      <div className="login-form">
        <div className="left-section">
          <img src="src\assets\Login.png" alt="Imagen de la izquierda" />
        </div>
        <div className="right-section ">
          <form onSubmit={handleSubmit}>
            <InputField
              label="Usuario"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <InputField
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Iniciar sesión</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
