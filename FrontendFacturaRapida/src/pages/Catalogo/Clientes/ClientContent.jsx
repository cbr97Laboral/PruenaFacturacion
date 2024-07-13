import { useState, useEffect } from "react";
import axios from "axios";
import Table from "../../../Componentes/Datatable/Table";
import "./ClientContent.css";
import ModalCliente from "../../../Componentes/Modales/ModalCliente";

import { getAllClientes } from "../../../Solicitudes/clientesS";
import { mostrarExito, mostrarError } from "../../../UtilidadesJS/ModalesInformativos/swalConfig";

const ClientContent = () => {
  const [isModalOpenCliente, setIsModalClienteOpen] = useState(false);
  const [modalClienteData, setModalClienteData] = useState({});
  const [idModalCliente, idModalClientsetIdModalClientee] = useState(null);

  const [data, setData] = useState([]);

  const consumirGetAllClientes = async () => {

    let result = await getAllClientes();
    if (result == null) {
      return;
    }
    setData(result);
  };

  useEffect(() => {
    consumirGetAllClientes();
  }, []);

  const handleAddRow = () => {
    setModalClienteData({});
    idModalClientsetIdModalClientee(-1);
    setIsModalClienteOpen(true);
  };

  const handleEditRow = (rowData) => {
    const newModalData = {
      nombre: rowData.nombre,
      razonSocial: rowData.razonSocial,
      rucDni: rowData.rucDni,
      correo: rowData.correo,
      direccion:  rowData.direccion,
      activo:  rowData.activo,
    };
    
    setModalClienteData(newModalData);
    idModalClientsetIdModalClientee(rowData.idCliente);
    setIsModalClienteOpen(true);
  };

  const handleClose = () => {
    setIsModalClienteOpen(false);
  };

  const handleDeleteRows = async (selectedRows) => {
    const selectedData = selectedRows.data().toArray();

    try {
      await Promise.all(
        selectedData.map((client) =>
          axios.put(`api/clientes/${client.idCliente}`, {
            ...client,
            activo: false,
          })
        )
      );
      consumirGetAllClientes();
      mostrarExito();
    } catch (error) {
      mostrarError();
      console.error("Error deleting rows:", error);
    }
  };

  const columns = [
    { title: "ID", data: "idCliente" },
    { title: "Nombre", data: "nombre" },
    { title: "Razon Social", data: "razonSocial" },
    { title: "RucDni", data: "rucDni" },
    { title: "Correo", data: "correo" },
    { title: "Dirección", data: "direccion" },
    { title: "Estado", data: "activo" },
  ];

  return (
    <div className="contenido-dinamico">
      <h1>Clientes</h1>
      <div className="tableDinamico">
        <Table
          data={data}
          columns={columns}
          onAddRow={handleAddRow}
          onDeleteRows={handleDeleteRows}
          onEditRow={handleEditRow}
        />
      </div>
      <ModalCliente
        isOpen={isModalOpenCliente}
        modalConfig={modalClienteData}
        id={idModalCliente}
        fetchData={consumirGetAllClientes}
        handleClose={handleClose}
      />
    </div>
  );
};

export default ClientContent;
