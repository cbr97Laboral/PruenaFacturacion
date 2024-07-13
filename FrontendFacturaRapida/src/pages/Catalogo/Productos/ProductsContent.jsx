import { useState, useEffect } from "react";
import axios from "axios";
import Table from "../../../Componentes/Datatable/Table";
import ModalProducto from "../../../Componentes/Modales/ModalProducto";
import { mostrarExito, mostrarError } from "../../../UtilidadesJS/ModalesInformativos/swalConfig";

const ProductsContent = () => {
  const [isModalOpenProducto, setIsModalProductoOpen] = useState(false);
  const [modalDataProducto, setModalDataProducto] = useState({});
  const [idModalProducto, setidModalProducto] = useState();

  const [data, setData] = useState([]);
  const fetchData = async () => {
    try {
      const response = await axios.get("api/productos");

      if (response.data != null || response.data != "" || response.data != []) {
        setData(response.data);
      }
    } catch (error) {
      mostrarError();
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddRow = async () => {
    setModalDataProducto({});
    setidModalProducto(-1);
    setIsModalProductoOpen(true);
  };

  const handleEditRow = async (rowData) => {
    const newModalData = {
      nombre: rowData.nombre,
      precio: rowData.precio+"",
      stock: rowData.stock+"",
      codigo: rowData.codigo,
      activo:  rowData.activo,
    };
    
    setModalDataProducto(newModalData);
    setidModalProducto(rowData.idProducto);
    setIsModalProductoOpen(true);
  };

  const handleClose = () => {
    setIsModalProductoOpen(false);
  };

  const handleDeleteRows = async (selectedRows) => {
    const selectedData = selectedRows.data().toArray();

    try {
      await Promise.all(
        selectedData.map((client) =>
          axios.put(`api/productos/${client.idProducto}`, {
            ...client,
            activo: false,
          })
        )
      );
      fetchData();
      mostrarExito();
    } catch (error) {
      console.error("Error deleting rows:", error);
    }
  };

  const columns = [
    { title: "ID", data: "idProducto" },
    { title: "Nombre", data: "nombre" },
    { title: "precio", data: "precio" },
    { title: "stock", data: "stock" },
    { title: "codigo", data: "codigo" },
    { title: "fechaCreacion", data: "fechaCreacion" },
    { title: "activo", data: "activo" },
  ];

  return (
    <div className="contenido-dinamico">
      <h1>Productos</h1>
      <div className="tableDinamico">
        <Table
          data={data}
          columns={columns}
          onAddRow={handleAddRow}
          onDeleteRows={handleDeleteRows}
          onEditRow={handleEditRow}
        />
      </div>
      <ModalProducto
        isOpen={isModalOpenProducto}
        modalConfig={modalDataProducto}
        id={idModalProducto}
        fetchData={fetchData}
        handleClose={handleClose}
      />
    </div>
  );
};

export default ProductsContent;
