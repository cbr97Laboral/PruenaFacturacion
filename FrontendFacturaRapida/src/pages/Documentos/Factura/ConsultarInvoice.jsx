import TablaFactura from "../../../Componentes/Datatable/TablaFactura";
import { useState, useEffect } from "react";
import axios from "axios";

const ConsultarInvoice = () => {
  const [dataCabecera, setDataCabecera] = useState([]);

  const fetchDataFactura = async () => {
    try {
      const response = await axios.get("api/FacturasCabeceras");

      if (response.data) {
        setDataCabecera(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  useEffect(() => {
    fetchDataFactura();
  }, []);

  const columns = [
    { title: "ID", data: "idFactura" },
    { title: "Numero de factura", data: "numeroFactura" },
    { title: "Razon Social", data: "razonSocialCliente" },
    { title: "Cliente", data: "idCliente" },
    { title: "RucDni", data: "rucDniCliente" },
    { title: "Correo", data: "correo" },
    { title: "Subtotal", data: "subtotal" },
    { title: "IVG%", data: "ivgPorcentual" },
    { title: "IVG", data: "ivg" },
    { title: "Total", data: "total" },
  ];

  return (
    <div>
      <div>
        <TablaFactura
          data={dataCabecera}
          columns={columns}
        />
      </div>
    </div>
  );
};

export default ConsultarInvoice;
