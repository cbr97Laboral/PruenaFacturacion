namespace BackendFacturaRapida.Models.DB;

public partial class FacturasCabecera
{
    public int IdFactura { get; set; }

    public int NumeroFactura { get; set; }

    public int IdCliente { get; set; }

    public string RucDniCliente { get; set; } = null!;

    public string RazonSocialCliente { get; set; } = null!;

    public string? Correo { get; set; }

    public decimal Subtotal { get; set; }

    public decimal IvgPorcentual { get; set; }

    public decimal? Ivg { get; set; }

    public decimal? Total { get; set; }

    public virtual ICollection<FacturasDetalle> FacturasDetalles { get; set; } = new List<FacturasDetalle>();

    public virtual Cliente IdClienteNavigation { get; set; } = null!;
}
