using System;
using System.Collections.Generic;

namespace BackendFacturaRapida.Models.DB;

public partial class Cliente
{
    public int IdCliente { get; set; }

    public string Nombre { get; set; } = null!;

    public string? Direccion { get; set; }

    public string? Correo { get; set; }

    public string RucDni { get; set; } = null!;

    public string RazonSocial { get; set; } = null!;

    public DateTime FechaCreacion { get; set; }

    public bool Activo { get; set; } = true;

    public virtual ICollection<FacturasCabecera> FacturasCabeceras { get; set; } = new List<FacturasCabecera>();
}
