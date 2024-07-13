import Swal from "sweetalert2";

export const mostrarExito = () => {
  mostrarExitoPM("Operación exitosa");
};

export const mostrarError = () => {
  mostrarErrorPM("Ups algo fallo, intento de nuevo");
};

export const mostrarExitoPM = (mensaje) => {
  Swal.fire({
    position: "center",
    icon: "success",
    title: mensaje,
    showConfirmButton: false,
    timer: 1500,
  });
};

export const mostrarErrorPM = (mensaje) => {
  Swal.fire({
    position: "center",
    icon: "error",
    title: mensaje,
    showConfirmButton: false,
    timer: 1500,
  });
};

export const mostrarModalConfirmacion = async (accion, mensaje) => {
  const result = await Swal.fire({
    title: `¿Estás seguro de ${accion} ${mensaje}?`,
    text: 'No podrás revertir la acción',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: `${accion} ${mensaje}`,
    cancelButtonText: 'Cerrar',
  });

  return result.isConfirmed;
};

export const mostrarNoPasaFiltroValidacion = (mensaje) =>{
  mostrarModalValidacion("Necesitamos que cumplas lo siguiente",mensaje);
}

export const mostrarModalValidacion = (titulo,mensaje) =>{
  Swal.fire({
    title: titulo,
    text: mensaje,
    icon:"info",
    html: mensaje.replace(/\n/g, '<br>'),
    confirmButtonText:"Lo revisare"
  });
}

export const mostrarNotificacionWarning =(titulo, mensaje)=>{
  Swal.fire({
    position: "center",
    icon:"warning",
    title: titulo,
    text: mensaje,
    confirmButtonText:"Cerrar",
  });
}