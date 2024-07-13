import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import $ from "jquery";
import "datatables.net";
import "datatables.net-buttons";
import "datatables.net-select";
import "../../../public/datatable/datatables.min.css";
import "./TablaDetalle.css";

const TablaDetalle = ({ data, onClose }) => {
  const columnsDetalle = [
    { title: "ID", data: "idItem" },
    { title: "Codigo", data: "codigoProducto" },
    { title: "Producto", data: "nombreProducto" },
    { title: "precio", data: "precioProducto" },
    { title: "Cantidad", data: "cantidadSolicitada" },
    { title: "Subtotal", data: "subtotal" },
  ];

  const tableRef = useRef(null);
  let dataTable = useRef(null);

  useEffect(() => {
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      dataTable.current.destroy();
    }

    dataTable.current = $(tableRef.current).DataTable({
      data: data,
      columns: columnsDetalle,
      searching: true,
      responsive: true,
      layout: {
        topStart: "pageLength",
        topEnd: "search",
        bottomStart: "info",
        bottomEnd: "paging",
      },
    });
  }, [data]);

  return (
    <div className="modal-factura-detalle-overlay">
      <div className="contenedor-colum-detalle-factura-consultar">
        <table ref={tableRef} className="display" style={{ width: "100%" }}>
          <thead>
            <tr>
              {columnsDetalle.map((col, index) => (
                <th key={index}>{col.title}</th>
              ))}
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <div className="modal-factura-producto-actions">
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

TablaDetalle.propTypes = {
  data: PropTypes.array.isRequired,

  onClose: PropTypes.func.isRequired,
};

export default TablaDetalle;
