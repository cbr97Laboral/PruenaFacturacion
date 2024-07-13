namespace BackendFacturaRapida.Models.View.Cliente
{
    public class ClienteViewModel
    {
        public string Nombre { get; set; }
        public string Direccion { get; set; }
        public string Correo { get; set; }
        public string RucDni { get; set; }
        public string RazonSocial { get; set; }
        public bool Activo { get; set; }
    }
}
