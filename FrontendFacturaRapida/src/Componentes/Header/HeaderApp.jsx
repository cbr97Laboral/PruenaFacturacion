
import { useNavigate } from 'react-router-dom';
import logoEmpresa from '../../assets/Logo.png';
import './HeaderApp.css'; 
const HeaderApp = () => {

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="logo-container">
        <img src={logoEmpresa} alt="Logo de la Empresa" className="logo" />
      </div>
      <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
    </header>
  );
};

export default HeaderApp;
