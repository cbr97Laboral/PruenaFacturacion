import { useState } from 'react';
import Header from '../Componentes/Header/HeaderApp';
import Sidebar from '../Componentes/Nav/Sidebar';
import Content from './Content';
import './App.css';
const App = () => {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');

  const handleMenuSelect = (menuOption) => {
    setSelectedMenu(menuOption);
  };

  return (
    <div className="app">
      <Header />
      <div className="app-body">
        <Sidebar onSelect={handleMenuSelect} />
        <Content selectedMenu={selectedMenu} />
      </div>
    </div>
  );
};

export default App;
