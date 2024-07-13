using System;
using System.Collections.Generic;

namespace BackendFacturaRapida.Models.DB;

public partial class LoginControl
{
    public int LoginControlId { get; set; }

    public string Username { get; set; } = null!;

    public short LoginAttempts { get; set; }
}
