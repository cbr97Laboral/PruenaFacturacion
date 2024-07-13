import "./CrearInvoice.css";

import { getAllClientesActivo } from "../../../Solicitudes/clientesS";
import { getAllProductsActivo } from "../../../Solicitudes/productosS";
import axios from "axios";
import { useState, useEffect } from "react";
import InputSelect from "../../../Componentes/Inputs/InputSelect ";
import Table from "../../../Componentes/Datatable/Table";
import ModalCliente from "../../../Componentes/Modales/ModalCliente";
import ModalFacturaProducto from "../../../Componentes/Modales/ModalFacturaProducto";
import {
  mostrarExito,
  mostrarError,
  mostrarModalConfirmacion,
  mostrarNoPasaFiltroValidacion,
} from "../../../UtilidadesJS/ModalesInformativos/swalConfig";

const CrearInvoice = () => {
  //#region Modal Add cliente
  const [isModalOpenCliente, setIsModalClienteOpen] = useState(false);
  const [modalClienteData, setModalClienteData] = useState({});
  const [idModalCliente, setIdModalCliente] = useState(null);

  const handleClose = () => {
    setIsModalClienteOpen(false);
  };

  const AgregarCliente = () => {
    setModalClienteData({});
    setIdModalCliente(-1);
    setIsModalClienteOpen(true);
  };

  const consumirGetAllClientesActivo = async () => {
    let result = await getAllClientesActivo();
    if (result == null) {
      return;
    }

    const clientes = result.map(
      ({ idCliente, nombre, razonSocial, rucDni, correo }) => ({
        idCliente: idCliente,
        nombre: nombre,
        razonSocial: razonSocial,
        rucDni: rucDni,
        correo: correo,
      })
    );

    const clientesSelect = clientes.map(({ idCliente, nombre }) => ({
      value: idCliente.toString(),
      label: nombre,
    }));
    setDataCliente(clientes);
    setClientesSelect(clientesSelect);
  };

  useEffect(() => {
    consumirGetAllClientesActivo();
    consumirGetAllProductsActivos();
  }, []);
  //#endregion

  //#region Modal productos a detalle
  const [productos, setProductos] = useState([]);
  const [modalOpenProductoDetalle, setModalOpenProductoDetalle] =
    useState(false);

  const [defaultProducto, setDefaultProducto] = useState(null);
  const [productosDetalle, setProductosDetalle] = useState([]);

  const openModalProductoDetalle = () => setModalOpenProductoDetalle(true);

  const closeModal = () => setModalOpenProductoDetalle(false);

  const onAgregarNuevoProducto = () => {
    setDefaultProducto({ id: "mensaje", cantidad: 1, idEdit: "-1" });
    openModalProductoDetalle();
  };
  const consumirGetAllProductsActivos = async () => {
    let result = await getAllProductsActivo();
    if (result == null) {
      return;
    }

    const productosData = result.map(
      ({ idProducto, nombre, precio, codigo }) => ({
        id: idProducto + "",
        nombre: nombre,
        precio: precio,
        codigo: codigo,
      })
    );

    setProductos(productosData);
  };
  //#endregion

  //#region Tabla
  const onAgregarProducto = (data, idEdit) => {
    if (idEdit == "-1") {
      setProductosDetalle([...productosDetalle, data]);
    } else {
      const updatedProductosDetalle = productosDetalle.map((producto) =>
        producto.id == idEdit ? { ...producto, ...data } : producto
      );
      setProductosDetalle(updatedProductosDetalle);
    }
    closeModal();
  };

  const handleDeleteRows = async (selectedRows) => {
    const selectedData = selectedRows.data().toArray();
    const selectedIds = selectedData.map((row) => row.id);
    const updatedProductosDetalle = productosDetalle.filter(
      (producto) => !selectedIds.includes(producto.id)
    );
    setProductosDetalle(updatedProductosDetalle);

    mostrarExito();
  };

  const handleEditRowDetalle = (rowData) => {
    openModalProductoDetalle();
    setDefaultProducto({
      id: rowData.id + "",
      cantidad: rowData.cantidad,
      idEdit: rowData.id + "",
    });
  };

  const columns = [
    { title: "ID", data: "id" },
    { title: "Codigo", data: "codigo" },
    { title: "Producto", data: "nombre" },
    { title: "precio", data: "precio" },
    { title: "Cantidad", data: "cantidad" },
    { title: "Subtotal", data: "subtotal" },
  ];
  //#endregion

  //#region Select clientes
  const [dataCliente, setDataCliente] = useState([]);

  const defaultClienteSeleccionado = {
    idCliente: "",
    razonSocial: "",
    rucDni: "",
    correo: "",
  };

  const [clienteSeleccionado, setClienteSeleccionado] = useState(
    defaultClienteSeleccionado
  );

  const [clientesSelect, setClientesSelect] = useState([]);

  const SelectCliente = (e) => {
    setIsModalClienteOpen(false);
    const selectedValue = e.target.value;
    if (selectedValue == "mensaje") {
      setClienteSeleccionado(defaultClienteSeleccionado);
      return;
    }

    const selectedClient = dataCliente.find(
      (client) => client.idCliente == selectedValue
    );
    if (selectedClient) {
      setClienteSeleccionado({
        idCliente: selectedClient.idCliente,
        razonSocial: selectedClient.razonSocial,
        rucDni: selectedClient.rucDni,
        correo: selectedClient.correo,
      });
    }
  };

  //#endregion

  //#region Resumen
  const [porcentageIVG, setPorcentageIVG] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const IVG = (subtotal * porcentageIVG) / 100;
  const total = subtotal + IVG;

  useEffect(() => {
    if (productosDetalle.length == 0) {
      setSubtotal(0);
      return;
    }

    let subtotalesGlobal = productosDetalle.map(
      (producto) => producto.subtotal
    );
    let subtotalGlobal = subtotalesGlobal.reduce(
      (total, subtotal) => total + subtotal,
      0
    );
    setSubtotal(subtotalGlobal);
  }, [productosDetalle]);

  //#endregion

  //#region Acciones de factura
  const [facturaCreada, setFacturaCreada] = useState({
    idFacturaCreada: "",
    numeroFacturaCreada: "",
  });

  let btnBloqueado = false;

  const cumpleValidacionAddFactura = (detallesProductos) => {
    let mensaje = "";
    if (!detallesProductos || detallesProductos.length < 1) {
      mensaje += "Debes tener al menos un producto en el detalle.";
    }

    if (!clienteSeleccionado || clienteSeleccionado.idCliente == "") {
      mensaje += "\nDebes tener un cliente seleccionado.";
    }

    let cumpleRequisitos = mensaje == "";
    if (!cumpleRequisitos) {
      mostrarNoPasaFiltroValidacion(mensaje);
    }

    return cumpleRequisitos;
  };

  const agregarFactura = async () => {
    const detallesProductos = productosDetalle.map((row) => ({
      idProducto: row.id,
      cantidadSolicitada: row.cantidad,
    }));

    if (!cumpleValidacionAddFactura(detallesProductos)) {
      return;
    }

    if (!(await mostrarModalConfirmacion("crear", "la factura"))) {
      return;
    }

    if (btnBloqueado) {
      return;
    }

    btnBloqueado = true;

    try {
      const facturaData = {
        idCliente: clienteSeleccionado.idCliente,
        ivgPorcentual: porcentageIVG,
        detalles: detallesProductos,
      };

      const response = await axios.post(
        "api/Facturas/crearfactura",
        facturaData
      );

      if (response.status == 200 && response.data.mensaje == "Exito") {
        const { idFactura, numeroFactura } = response.data;
        setFacturaCreada({
          idFacturaCreada: idFactura,
          numeroFacturaCreada: numeroFactura,
        });
        mostrarExito();
        btnBloqueado = false;
      }

      return response.data;
    } catch (error) {
      mostrarError();
      btnBloqueado = false;
      console.error("Error al agregar factura:", error);
      throw error;
    }
  };
  //#endregion

  return (
    <div className="factura-crear-container">
      {/* Primera fila principal: Cabecera */}
      <div className="factura-cabecera-header">
        <div className="factura-detalle-cabecera">
          <header className="factura-cabecera-title">Cabecera</header>
          <button className="factura-btn-guardar" onClick={agregarFactura}>
            Guardar factura
          </button>
        </div>

        {/* Subfila 1: ID factura y Número de factura */}
        <div className="factura-cabecera-subheader">
          <div className="factura-cabecera-field">
            <div className="field-label">ID Factura:</div>
            <div className="field-value">
              {facturaCreada.idFacturaCreada || ""}
            </div>
          </div>
          <div className="factura-cabecera-field">
            <div className="field-label">Número de Factura:</div>
            <div className="field-value">
              {facturaCreada.numeroFacturaCreada || ""}
            </div>
          </div>
        </div>

        {/* Subfila 2: Información del cliente */}
        <div className="factura-cabecera-container-cliente">
          <InputSelect
            label="Cliente"
            options={clientesSelect}
            onSelectChange={SelectCliente}
            iconSrc="src\assets\AddUser.png"
            onButtonClick={AgregarCliente}
          />

          <div className="factura-cabecera-subheader-cliente">
            <div className="factura-cabecera-field">
              <div className="field-label">ID Cliente:</div>
              <div className="field-value">{clienteSeleccionado.idCliente}</div>
            </div>
            <div className="factura-cabecera-field">
              <div className="field-label">Razón Social:</div>
              <div className="field-value">
                {clienteSeleccionado.razonSocial}
              </div>
            </div>
            <div className="factura-cabecera-field">
              <div className="field-label">RUC:</div>
              <div className="field-value">{clienteSeleccionado.rucDni}</div>
            </div>
            <div className="factura-cabecera-field">
              <div className="field-label">Correo:</div>
              <div className="field-value">{clienteSeleccionado.correo}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Segunda fila principal: Detalle y Resumen */}
      <div className="factura-cabecera-content">
        <div className="factura-cabecera-detail">
          <div className="factura-detalle-cabecera">
            <header className="factura-cabecera-title">Detalle</header>
          </div>
          <Table
            data={productosDetalle}
            columns={columns}
            onAddRow={onAgregarNuevoProducto}
            onDeleteRows={handleDeleteRows}
            onEditRow={handleEditRowDetalle}
          />
        </div>
        <div className="factura-cabecera-summary">
          <header className="factura-cabecera-title">Resumen</header>
          <div className="resumen-seccion1">
            <div className="summary-item">
              <div className="summary-label">Subtotal:$</div>
              <div className="summary-value">{subtotal.toFixed(2)}</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Porcentaje IVG:</div>
              <input
                className="summary-value summary-input-ivg"
                type="number"
                value={porcentageIVG}
                onChange={(e) => setPorcentageIVG(Number(e.target.value))}
              />
              %
            </div>
            <div className="summary-item">
              <div className="summary-label">IVG:$</div>
              <div className="summary-value">{IVG.toFixed(2)}</div>
            </div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Total:$</div>
            <div className="summary-value">{total.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <ModalCliente
        isOpen={isModalOpenCliente}
        modalConfig={modalClienteData}
        id={idModalCliente}
        fetchData={consumirGetAllClientesActivo}
        handleClose={handleClose}
      />
      {modalOpenProductoDetalle && (
        <ModalFacturaProducto
          onClose={closeModal}
          onAgregarProducto={onAgregarProducto}
          defaultProducto={defaultProducto}
          productos={productos}
          fetchProductos={consumirGetAllProductsActivos}
        />
      )}
    </div>
  );
};

export default CrearInvoice;
