import TablaDetalle from "../../Componentes/Datatable/TablaDetalle";
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import $ from "jquery";
import "datatables.net";
import "datatables.net-buttons";
import "datatables.net-select";
import "../../../public/datatable/datatables.min.css";
import "./TablaFactura.css";
import axios from "axios";

import {
  mostrarExito,
  mostrarError,
  mostrarModalConfirmacion,
} from "../../UtilidadesJS/ModalesInformativos/swalConfig";

const TablaFactura = ({ data, columns }) => {
  const tableRef = useRef(null);
  let dataTable = useRef(null);

  //#region Modal detalle

  const [modalOpenDetalle, setModalOpenDetalle] = useState(false);

  const closeModal = () => setModalOpenDetalle(false);

  const [dataDetalle, setDataDetalle] = useState([]);

  const verDetalle = async (id) => {
    console.log(id);
    try {
      const response = await axios.get(`api/FacturasDetalles/detalles/${id}`);

      console.log(JSON.stringify(response.data, null, 3));
      if (response.data) {
        setDataDetalle(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setModalOpenDetalle(true);
  };
  //#endregion

  useEffect(() => {
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      dataTable.current.destroy();
    }

    const updatedColumns = [
      ...columns,
      {
        title: "Ver detalle",
        data: null,
        orderable: false,
        searchable: false,
        render: () => {
          return `<button title="Ver detalle de factura" class="edit-button"><img src="src/assets/eyes.png" alt="Editar" /></button>`;
        },
      },
    ];

    dataTable.current = $(tableRef.current).DataTable({
      data: data,
      columns: updatedColumns,
      searching: true,
      responsive: true,
      select: {
        style: "os",
        selector: "td:not(.no-select)",
      },
      columnDefs: [
        { targets: [updatedColumns.length - 1], className: "no-select" },
      ],

      layout: {
        topStart: "pageLength",
        topEnd: "search",
        bottomStart: "info",
        bottomEnd: "paging",
      },
    });

    $(tableRef.current).off("click", ".edit-button");
    $(tableRef.current).on("click", ".edit-button", function () {
      const row = dataTable.current.row($(this).closest("tr")).data();
      verDetalle(row.idFactura);
    });
  }, [data, columns]);

  const handleDeleteSelectedRows = async () => {
    const selectedRows = dataTable.current.rows({ selected: true });

    if (!selectedRows.any()) {
      alert("Selecciona al menos una factura para eliminar.");
      return;
    }

    let cantidadFacturas =
      selectedRows.count() > 1 ? "las facturas" : "la factura";

    if (!(await mostrarModalConfirmacion("eliminar", cantidadFacturas))) {
      return;
    }

    try {
      const facturaIds = selectedRows.data().map((row) => row.idFactura);
      console.log(facturaIds);
      let ids = [];

      facturaIds.map(async (idFactura) => {
        ids.push(idFactura);
      });

      ids.forEach(async (idFactura) => {
        console.log(idFactura);
        await axios.delete(`api/Facturas/eliminarfacturas/${idFactura}`);
      });

      selectedRows.remove().draw();
      mostrarExito();
    } catch (error) {
      mostrarError();
      console.error("Error al eliminar facturas:", error);
    }
  };

  const handleSelectAllRows = () => {
    dataTable.current.rows().select();
  };

  const handleDeselectAllRows = () => {
    dataTable.current.rows().deselect();
  };

  return (
    <div className="contenedor-colum">
      <div className="table-buttons-personalida">
        <div className="tabla-contenedor-ordenar">
          <label className="seleccionarTodos">Seleccionar:</label>
          <div className="tabla-opciones-seleccionar">
            <button
              className="deselect-all-button"
              onClick={handleDeselectAllRows}
            >
              Ninguno
            </button>
            <button className="select-all-button" onClick={handleSelectAllRows}>
              Todos
            </button>
          </div>
        </div>
        <div className="tabla-contenedor-ordenar">
          <button
            className="delete-selected-button"
            onClick={handleDeleteSelectedRows}
          >
            Eliminar
          </button>
        </div>
      </div>
      <table ref={tableRef} className="display" style={{ width: "100%" }}>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.title}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>

      {modalOpenDetalle && (
        <TablaDetalle data={dataDetalle} onClose={closeModal} />
      )}
    </div>
  );
};

TablaFactura.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
};

export default TablaFactura;
