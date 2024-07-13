import { useState } from "react";
import PropTypes from "prop-types";
import "./DropdownOption.css";

const DropdownOption = ({
  title,
  options,
  onSelect,
  selectedOption,
  selectedTitle,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    onSelect(option, title);
  };

  return (
    <div className="dropdown">
      <div
        className={`dropdown-header ${
          selectedTitle === title ? "selected" : ""
        }`}
        onClick={handleToggle}
      >
        <div>{title}</div>
        <div className={`indicator ${isOpen ? "open" : ""}`}>
          <img src="src/assets/Flecha.svg" alt="indicador" />
        </div>
      </div>
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleOptionClick(option)}
              className={selectedOption === option ? "selected" : ""}
            >
              {selectedOption === option && (
                <img
                  src="src/assets/Flecha2.svg"
                  alt="indicador"
                />
              )}
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

DropdownOption.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedOption: PropTypes.string.isRequired,
  selectedTitle: PropTypes.string.isRequired,
};

export default DropdownOption;
