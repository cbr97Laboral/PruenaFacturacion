using System;
using System.Collections.Generic;

namespace BackendFacturaRapida.Models.DB;

public partial class User
{
    public int UserId { get; set; }

    public string Username { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public bool IsActive { get; set; }
}
