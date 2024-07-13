import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import "./ModalAddEdit.css";

const ModalAddEdit = ({ isOpen, onSave, inputsConfig, id, modalTitle }) => {
  const [formData, setFormData] = useState({});
  const modal = document.querySelector(".modal-overlay");
  if (modal) {
    modal.classList.remove("modal-overlay-close");
  }
  
  useEffect(() => {
    const initialData = {};
    inputsConfig.forEach((input) => {
      initialData[input.id] = input.value || "";
    });
    setFormData(initialData);
  }, [inputsConfig, id]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData, id);
  };

  const handleClose = () => {
    const modal = document.querySelector(".modal-overlay");
    if (modal) {
      modal.classList.add("modal-overlay-close");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <header>
          {id === -1 ? `Agregar ${modalTitle}` : `Editar ${modalTitle}`}
        </header>
        <div className="modal-content">
          {inputsConfig.map((input) => (
            <div key={input.id} className="input-group">
              <label htmlFor={input.id}>{input.label}</label>
              {input.input === "Text" && (
                <input
                  type="text"
                  id={input.id}
                  value={formData[input.id]}
                  onChange={handleInputChange}
                />
              )}
              {input.input === "Select" && (
                <select
                  id={input.id}
                  value={formData[input.id]}
                  onChange={handleInputChange}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              )}
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button onClick={handleSave}>Guardar</button>
          <button onClick={handleClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

ModalAddEdit.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  inputsConfig: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      input: PropTypes.oneOf(["Text", "Select"]).isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  id: PropTypes.number,
  modalTitle: PropTypes.string.isRequired,
};

export default ModalAddEdit;
