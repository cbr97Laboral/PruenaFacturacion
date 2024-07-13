using System;
using System.Collections.Generic;

namespace BackendFacturaRapida.Models.DB;

public partial class ConfiguracionIntentosLogin
{
    public int Id { get; set; }

    public byte Intentos { get; set; }
}
