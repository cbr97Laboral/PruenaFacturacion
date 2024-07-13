﻿namespace BackendFacturaRapida.Models.View.Producto
{
    public class ProductoViewModel
    {
        public string Nombre { get; set; }
        public decimal Precio { get; set; }
        public int Stock { get; set; }
        public string Codigo { get; set; }
        public bool Activo { get; set; }
    }
}
