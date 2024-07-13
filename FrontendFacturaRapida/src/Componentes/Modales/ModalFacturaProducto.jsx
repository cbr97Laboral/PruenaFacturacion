import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import InputSelect from "../Inputs/InputSelect ";
import "./ModalFacturaProducto.css";
import ModalProducto from "./ModalProducto";
import {
  mostrarExito,
  mostrarNoPasaFiltroValidacion,
} from "../../UtilidadesJS/ModalesInformativos/swalConfig";

const ModalFacturaProducto = ({
  onClose,
  onAgregarProducto,
  defaultProducto,
  productos,
  fetchProductos,
}) => {
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [cantidad, setCantidad] = useState(defaultProducto?.cantidad || 1);

  useEffect(() => {
    if (defaultProducto?.id) {
      productoSeleccionado(productos, defaultProducto?.id, setSelectedProducto);

      setCantidad(defaultProducto?.cantidad);
    }
  }, [defaultProducto, productos]);

  const handleProductoSelectChange = (productoId) => {
    let idProductoSelect = productoId.target.value;
    productoSeleccionado(productos, idProductoSelect, setSelectedProducto);
  };

  function productoSeleccionado(
    productos,
    idProductoSelect,
    setSelectedProducto
  ) {
    const selected = productos.find(
      (producto) => producto.id == idProductoSelect
    );
    setSelectedProducto(selected);
  }

  const cumpleValidacionAddProducto = () => {
    let mensaje = "";
    if (!selectedProducto) {
      mensaje += "Debe tener un producto seleccionado";
    }

    if (cantidad < 1) {
      mensaje += "\nLa cantidad minima permitida es 1";
    }

    let cumpleValidacion = mensaje == "";

    if (!cumpleValidacion) {
      mostrarNoPasaFiltroValidacion(mensaje);
    }
    return cumpleValidacion;
  };

  const agregarProducto = () => {
    if (!cumpleValidacionAddProducto()) {
      return;
    }

    if (selectedProducto) {
      const subtotal = selectedProducto.precio * cantidad;
      onAgregarProducto(
        {
          id: selectedProducto.id,
          nombre: selectedProducto.nombre,
          precio: selectedProducto.precio,
          codigo: selectedProducto.codigo,
          cantidad: cantidad,
          subtotal: subtotal,
        },
        defaultProducto?.idEdit
      );
      mostrarExito();
    }
    onClose();
  };

  //#region Modal nuevo producto

  const [isModalOpenProducto, setIsModalProductoOpen] = useState(false);
  const [modalDataProducto, setModalDataProducto] = useState({});
  const [idModalProducto, setidModalProducto] = useState();

  const agregarNuevoProducto = async () => {
    setModalDataProducto({});
    setidModalProducto(-1);
    setIsModalProductoOpen(true);
  };

  const handleClose = () => {
    setIsModalProductoOpen(false);
  };
  //#endregion

  return (
    <div className="modal-factura-producto-overlay">
      <div className="modal-factura-producto">
        <header>
          {defaultProducto?.idEdit == "-1" ? "Agregar" : "Editar"} producto a
          detalle
        </header>
        <div className="modal-factura-producto-content">
          <InputSelect
            label="Producto"
            options={productos.map((producto) => ({
              value: producto.id + "",
              label: producto.nombre,
            }))}
            onSelectChange={handleProductoSelectChange}
            iconSrc="src\assets\AddGeneral.png"
            onButtonClick={agregarNuevoProducto}
            defaultValue={defaultProducto?.id + "" || ""}
          />
          {/*Precio y cantidad*/}
          <div className="modal-factura-producto-calculo">
            <div className="modal-factura-producto-input-group">
              <label>Precio:</label>
              {selectedProducto && (
                <span className="modal-factura-producto-precio-valor">
                  ${selectedProducto.precio}
                </span>
              )}
            </div>
            x
            <div className="modal-factura-producto-input-group">
              <label>Cantidad:</label>
              <input
                className="modal-factura-producto-input-cantidad"
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="modal-factura-producto-input-subtotal">
            <label>Subtotal:</label>
            {selectedProducto && (
              <span>${selectedProducto.precio * cantidad}</span>
            )}
          </div>
        </div>
        <div className="modal-factura-producto-actions">
          <button onClick={agregarProducto}>
            {defaultProducto?.idEdit == "-1" ? "Agregar" : "Editar"}
          </button>
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
      <ModalProducto
        isOpen={isModalOpenProducto}
        modalConfig={modalDataProducto}
        id={idModalProducto}
        fetchData={fetchProductos}
        handleClose={handleClose}
      />
    </div>
  );
};

ModalFacturaProducto.propTypes = {
  onClose: PropTypes.func.isRequired,
  fetchProductos: PropTypes.func.isRequired,
  onAgregarProducto: PropTypes.func.isRequired,
  defaultProducto: PropTypes.shape({
    id: PropTypes.string,
    cantidad: PropTypes.number,
    idEdit: PropTypes.string,
  }),
  productos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      precio: PropTypes.number.isRequired,
      codigo: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ModalFacturaProducto;
