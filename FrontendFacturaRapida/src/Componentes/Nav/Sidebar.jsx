import { useState } from "react";
import PropTypes from "prop-types";
import DropdownOption from "../Desplegable/DropdownOption";
import "./Sidebar.css";

const Sidebar = ({ onSelect }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");

  const handleMenuClick = (option, title) => {
    setSelectedOption(option);
    setSelectedTitle(title);
    onSelect(option);
  };

  return (
    <aside className="sidebar">
      <ul>
        <li>
          <DropdownOption
            title="Catalogo"
            options={["Clientes", "Productos"]}
            onSelect={handleMenuClick}
            selectedOption={selectedOption}
            selectedTitle={selectedTitle}
          />
        </li>
        <li>
          <DropdownOption
            title="Documento"
            options={["Factura"]}
            onSelect={handleMenuClick}
            selectedOption={selectedOption}
            selectedTitle={selectedTitle}
          />
        </li>
      </ul>
    </aside>
  );
};

Sidebar.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default Sidebar;
