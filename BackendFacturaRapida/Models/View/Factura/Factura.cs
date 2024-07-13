namespace BackendFacturaRapida.Models.View.Factura
{
    public class Factura
    {
        public int IdCliente { get; set; }
        public decimal IvgPorcentual { get; set; }

        public List<FacturaDetalleView> Detalles { get; set; }

        public Factura(int idCliente, decimal ivgPorcentual, List<FacturaDetalleView> detalles)
        {
            IdCliente = idCliente;
            IvgPorcentual = ivgPorcentual;
            Detalles = detalles ?? new List<FacturaDetalleView>();
        }

        public class FacturaDetalleView
        {
            public int IdProducto { get; set; }

            public int CantidadSolicitada { get; set; }
        }
    }
}
