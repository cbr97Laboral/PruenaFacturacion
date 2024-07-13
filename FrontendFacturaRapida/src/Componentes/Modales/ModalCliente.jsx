import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ModalAddEdit from "./ModalAddEdit";
import axios from "axios";
import { mostrarExito, mostrarError,mostrarNoPasaFiltroValidacion } from "../../UtilidadesJS/ModalesInformativos/swalConfig";

const ModalCliente = ({ isOpen, modalConfig, id, fetchData,handleClose }) => {
  
  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const [modalData, setModalData] = useState([
    { id: "Nombre", input: "Text", label: "Nombre", value: "" },
    { id: "RazonSocial", input: "Text", label: "Razon Social", value: "" },
    { id: "RucDni", input: "Text", label: "RucDni", value: "" },
    { id: "Correo", input: "Text", label: "Correo", value: "" },
    { id: "Dirección", input: "Text", label: "Dirección", value: "" },
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
        id: "RazonSocial",
        input: "Text",
        label: "Razon Social",
        value: config.razonSocial || "",
      },
      {
        id: "RucDni",
        input: "Text",
        label: "RucDni",
        value: config.rucDni || "",
      },
      {
        id: "Correo",
        input: "Text",
        label: "Correo",
        value: config.correo || "",
      },
      {
        id: "Dirección",
        input: "Text",
        label: "Dirección",
        value: config.direccion || "",
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
      mensaje += "\nNombre";
    }

    if (accionProducto.razonSocial == "") {
      mensaje += "\nRazon Social";
    }

    if (accionProducto.rucDni == "") {
      mensaje += "\nRucDni";
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
    const newClient = {
      nombre: clientData.Nombre,
      direccion: clientData.Dirección,
      correo: clientData.Correo,
      rucDni: clientData.RucDni,
      razonSocial: clientData.RazonSocial,
      activo: clientData.Estado === "Activo",
    };

    if (!cumplaValidacionAccion(newClient)) {
      return;
    }

    try {
      let response;
      if (id !== -1) {
        response = await axios.put(`api/Clientes/actualizar/${id}`, newClient);
      } else {
        response = await axios.post("api/clientes", newClient);
      }

      if (response.status === 204 || response.status === 201) {
        mostrarExito();
        fetchData();
        handleClose();
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
      modalTitle="Cliente"
    />
  );
};

ModalCliente.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  fetchData: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  modalConfig: PropTypes.object,
  id: PropTypes.number,
};

export default ModalCliente;
