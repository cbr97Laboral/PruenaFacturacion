import { useState, useEffect } from "react";
import axios from "axios";
import Table from "../../../Componentes/Datatable/Table";
import ModalProducto from "../../../Componentes/Modales/ModalProducto";
import {
  mostrarExito,
} from "../../../UtilidadesJS/ModalesInformativos/swalConfig";
import { getAllProducts } from "../../../Solicitudes/productosS";

const ProductsContent = () => {
  const [isModalOpenProducto, setIsModalProductoOpen] = useState(false);
  const [modalDataProducto, setModalDataProducto] = useState({});
  const [idModalProducto, setidModalProducto] = useState();

  const [data, setData] = useState([]);

  const consumirGetAllProducts = async () => {
    let result = await getAllProducts();
    if (result == null) {
      return;
    }
    setData(result);
  };

  useEffect(() => {
    consumirGetAllProducts();
  }, []);

  const handleAddRow = async () => {
    setModalDataProducto({});
    setidModalProducto(-1);
    setIsModalProductoOpen(true);
  };

  const handleEditRow = async (rowData) => {
    const newModalData = {
      nombre: rowData.nombre,
      precio: rowData.precio + "",
      stock: rowData.stock + "",
      codigo: rowData.codigo,
      activo: rowData.activo,
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
      consumirGetAllProducts();
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
        fetchData={consumirGetAllProducts}
        handleClose={handleClose}
      />
    </div>
  );
};

export default ProductsContent;
