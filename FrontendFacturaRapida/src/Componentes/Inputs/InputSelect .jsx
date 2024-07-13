import PropTypes from "prop-types";
import "./InputSelect.css";
import { useEffect, useState } from "react";

const InputSelect = ({
  label,
  options,
  onSelectChange,
  iconSrc,
  onButtonClick,
  defaultValue,
}) => {
  //#region soporte a preseleccion en select
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
    onSelectChange(event);
  };
  //#endregion

  const defaultOption = options.length > 0 ? "Seleccione" : "No hay datos";

  return (
    <div className="container-InputSelect">
      <label className="input-label-select">{label}:</label>
      <select 
      className="input-select"
       onChange={handleSelectChange}
       value={selectedValue} 
       name="select">
        <option value="mensaje">{defaultOption}</option>
        {options.map((option) => (
          <option
            className="input-opcion-select"
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
      <button className="iconBtn" onClick={() => onButtonClick()}>
        <img className="imgIcon" src={iconSrc} alt="Icono" />
      </button>
    </div>
  );
};

InputSelect.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSelectChange: PropTypes.func.isRequired,
  iconSrc: PropTypes.string.isRequired,
  onButtonClick: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
};

export default InputSelect;
