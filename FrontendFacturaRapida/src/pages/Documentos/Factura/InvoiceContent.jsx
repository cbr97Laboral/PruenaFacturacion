import { useState } from 'react';
import ConsultarInvoice from './ConsultarInvoice';
import CrearInvoice from './CrearInvoice';
import './InvoiceContent.css';

const InvoiceContent = () => {
  const [selectedOption, setSelectedOption] = useState('Consultar');

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div>
      <div className="header-row">
        <h1>Facturas</h1>
        <div className="options">
          <span
            className={`option ${selectedOption === 'Consultar' ? 'selected' : ''}`}
            onClick={() => handleOptionClick('Consultar')}
          >
            Consultar
          </span>
          <span
            className={`option ${selectedOption === 'Crear' ? 'selected' : ''}`}
            onClick={() => handleOptionClick('Crear')}
          >
            Crear
          </span>
        </div>
      </div>
      <div className="content-row">
        {selectedOption === 'Consultar' && <ConsultarInvoice />}
        {selectedOption === 'Crear' && <CrearInvoice />}
      </div>
    </div>
  );
};

export default InvoiceContent;
