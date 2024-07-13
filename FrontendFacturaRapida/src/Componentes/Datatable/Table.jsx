import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import $ from "jquery";
import "datatables.net";
import "datatables.net-buttons";
import "datatables.net-select";
import "../../../public/datatable/datatables.min.css";
import "./table.css";

const Table = ({ data, columns, onAddRow, onDeleteRows, onEditRow }) => {
  const tableRef = useRef(null);
  let dataTable = useRef(null);

  useEffect(() => {
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      dataTable.current.destroy();
    }
    
    const updatedColumns = [
      ...columns,
      {
        title: "Acciones",
        data: null,
        orderable: false,
        searchable: false,
        render: () => {
          return `<button class="edit-button"><img src="src/assets/edit.png" alt="Editar" /></button>`;
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
      onEditRow(row);
    });
  }, [data, columns, onAddRow, onDeleteRows, onEditRow]);

  const handleAddRow = () => {
    onAddRow();
  };

  const handleDeleteSelectedRows = () => {
    const selectedRows = dataTable.current.rows({ selected: true });

    if (selectedRows.any()) {
      onDeleteRows(selectedRows);
    } else {
      alert("Selecciona al menos una fila para eliminar.");
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
          <button className="add-row-button" onClick={handleAddRow}>
            Crear
          </button>
          <button
            className="delete-selected-button"
            onClick={handleDeleteSelectedRows}
          >
            Inactivar
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
    </div>
  );
};

Table.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  onAddRow: PropTypes.func.isRequired,
  onDeleteRows: PropTypes.func.isRequired,
  onEditRow: PropTypes.func.isRequired,
};

export default Table;
