namespace BackendFacturaRapida.Models.DB;

public partial class FacturasDetalle
{
    public int IdItem { get; set; }

    public int IdFactura { get; set; }

    public int IdProducto { get; set; }

    public string CodigoProducto { get; set; } = null!;

    public string NombreProducto { get; set; } = null!;

    public decimal PrecioProducto { get; set; }

    public int CantidadSolicitada { get; set; }

    public decimal? Subtotal { get; set; }

    public virtual FacturasCabecera IdFacturaNavigation { get; set; } = null!;

    public virtual Producto IdProductoNavigation { get; set; } = null!;
}
