import { useState, useEffect } from "react";
import axios from "axios";
import Table from "../../../Componentes/Datatable/Table";
import "./ClientContent.css";
import ModalCliente from "../../../Componentes/Modales/ModalCliente";

import { mostrarExito, mostrarError } from "../../../UtilidadesJS/ModalesInformativos/swalConfig";

const ClientContent = () => {
  const [isModalOpenCliente, setIsModalClienteOpen] = useState(false);
  const [modalClienteData, setModalClienteData] = useState({});
  const [idModalCliente, idModalClientsetIdModalClientee] = useState(null);

  const [data, setData] = useState([]);

  const fetchDataCliente = async () => {
    try {
      const response = await axios.get("api/clientes");

      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDataCliente();
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
      fetchDataCliente();
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
        fetchData={fetchDataCliente}
        handleClose={handleClose}
      />
    </div>
  );
};

export default ClientContent;
