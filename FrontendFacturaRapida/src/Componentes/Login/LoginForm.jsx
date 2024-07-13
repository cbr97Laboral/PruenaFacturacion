import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InputField from "../Inputs/InputField";
import "./LoginForm.css";
import { mostrarNotificacionIntentos } from "../../UtilidadesJS/ModalesInformativos/swalConfig";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/App");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/Users/login", {
        username,
        password,
      });

      const { token } = response.data;

      localStorage.setItem("token", token);

      navigate("/App");
    } catch (error) {
      const { statusText, data } = error.response;
      let mensajeError = "";

      if (data == null || data == "") {
        mensajeError = statusText;
      } else {
        const { message } = error.response.data;
        mensajeError = message;
      }

      let msjSoporte = "Comuniquese con soporte";
      mostrarNotificacionIntentos(mensajeError, msjSoporte);
      setError("Error al iniciar sesión. Motivo:" + mensajeError);
    }
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
            {error && <p>{error}</p>}
            <button type="submit">Iniciar sesión</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
