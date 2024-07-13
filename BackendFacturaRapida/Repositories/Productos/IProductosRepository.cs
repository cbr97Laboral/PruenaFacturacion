﻿using BackendFacturaRapida.Models.DB;

namespace BackendFacturaRapida.Repositories.Productos
{
    public interface IProductosRepository
    {
        Task<List<Producto>> GetAllProductosAsync();
        Task<Producto> GetProductoByIdAsync(int id);
        Task<Producto> AddProductoAsync(Producto producto);
        Task<bool> UpdateProductoAsync(int id, Producto producto);
        Task<bool> DeleteProductoAsync(int id);
        Task<int> GetStockAsync(int idProducto);
        Task<bool> ActualizarStockAsync(int idProducto, int cantidad);
        Task<bool> ProductoExists(int id);
    }

}