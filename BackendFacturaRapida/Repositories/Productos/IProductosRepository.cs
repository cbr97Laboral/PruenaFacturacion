using BackendFacturaRapida.Models.DB;

namespace BackendFacturaRapida.Repositories.Productos
{
    public interface IProductosRepository
    {
        Task<List<Producto>> GetAllProductosAsync();
        Task<List<Producto>> GetAllProductosByEstadoAsync(bool activo);
        Task<Producto> GetProductoByIdAsync(int id);
        Task<Producto> AddProductoAsync(Producto producto);
        Task<bool> UpdateProductoAsync(int id, Producto producto);
        Task<bool> DeleteProductoAsync(int id);
        Task<int> GetStockAsync(int idProducto);
        Task<bool> AumentarStockAsync(int idProducto, uint cantidad);
        Task<bool> DisminuirStockAsync(int idProducto, uint cantidad);
        Task<bool> ProductoExists(int id);
    }

}
