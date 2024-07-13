import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ModalAddEdit from "./ModalAddEdit";
import axios from "axios";
import {
  mostrarExito,
  mostrarError,
  mostrarNoPasaFiltroValidacion,
} from "../../UtilidadesJS/ModalesInformativos/swalConfig";

const ModalProducto = ({ isOpen, modalConfig, id, fetchData, handleClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const [modalData, setModalData] = useState([
    { id: "Nombre", input: "Text", label: "Nombre", value: "" },
    { id: "Precio", input: "Text", label: "Precio", value: "" },
    { id: "Stock", input: "Text", label: "Stock", value: "" },
    { id: "Codigo", input: "Text", label: "Codigo", value: "" },
    { id: "Estado", input: "Select", label: "Estado", value: "Activo" },
  ]);

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    prepararDatosParaModal(modalConfig);
  }, [modalConfig]);

  const prepararDatosParaModal = (config) => {
    const newModalData = [
      {
        id: "Nombre",
        input: "Text",
        label: "Nombre",
        value: config.nombre || "",
      },
      {
        id: "Precio",
        input: "Text",
        label: "Precio",
        value: config.precio || "",
      },
      {
        id: "Stock",
        input: "Text",
        label: "Stock",
        value: config.stock || "",
      },
      {
        id: "Codigo",
        input: "Text",
        label: "Codigo",
        value: config.codigo || "",
      },
      {
        id: "Estado",
        input: "Select",
        label: "Estado",
        value: config.activo
          ? "Activo"
          : config.activo != undefined
          ? "Inactivo"
          : "Activo",
      },
    ];

    setModalData(newModalData);
  };

  const cumplaValidacionAccion = (accionProducto) => {
    let mensaje = "";

    if (accionProducto.nombre == "") {
      mensaje += "\nNombre.";
    }

    if (accionProducto.precio == "") {
      mensaje += "\nPrecio";
    }

    if (accionProducto.stock == "") {
      mensaje += "\nStock";
    }

    if (accionProducto.codigo == "") {
      mensaje += "\nCodigo";
    }

    let cumpleValidacion = mensaje == "";

    if (!cumpleValidacion) {
      mostrarNoPasaFiltroValidacion(
        "Los siguientes campos no pueden estar vacios" + mensaje
      );
    }

    return cumpleValidacion;
  };
  
  const handleSaveModal = async (clientData, id) => {
    const accionProducto = {
      nombre: clientData.Nombre,
      precio: clientData.Precio,
      stock: clientData.Stock,
      codigo: clientData.Codigo,
      activo: clientData.Estado === "Activo",
    };

    if (!cumplaValidacionAccion(accionProducto)) {
      return;
    }

    try {
      let response;
      if (id !== -1) {
        response = await axios.put(
          `api/Productos/actualizar/${id}`,
          accionProducto
        );
      } else {
        response = await axios.post("api/productos", accionProducto);
      }

      if (response.status === 204 || response.status === 201) {
        fetchData();
        handleClose();
        mostrarExito();
      } else {
        console.error("Error en la operación:", response.statusText);
      }
    } catch (error) {
      mostrarError();
      console.error("Error en la operación:", error);
    }
  };

  return (
    <ModalAddEdit
      isOpen={isModalOpen}
      onSave={handleSaveModal}
      inputsConfig={modalData}
      id={id}
      modalTitle="Producto"
    />
  );
};

ModalProducto.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  fetchData: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  modalConfig: PropTypes.object,
  id: PropTypes.number,
};

export default ModalProducto;
