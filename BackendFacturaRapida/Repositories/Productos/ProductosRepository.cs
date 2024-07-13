using BackendFacturaRapida.Models.DB;
using Microsoft.EntityFrameworkCore;

namespace BackendFacturaRapida.Repositories.Productos
{
    public class ProductosRepository : IProductosRepository
    {
        private readonly FacturacionRapidaDevContext _context;

        public ProductosRepository(FacturacionRapidaDevContext context)
        {
            _context = context;
        }

        public async Task<List<Producto>> GetAllProductosAsync()
        {
            return await _context.Productos.ToListAsync();
        }

        public async Task<Producto> GetProductoByIdAsync(int id)
        {
            return await _context.Productos.FindAsync(id);
        }

        public async Task<Producto> AddProductoAsync(Producto producto)
        {
            _context.Productos.Add(producto);
            await _context.SaveChangesAsync();
            return producto;
        }

        public async Task<bool> UpdateProductoAsync(int id, Producto producto)
        {
            if (id != producto.IdProducto)
                return false;

            if (! await ProductoExists(id))
                return false;

            try
            {
                _context.Entry(producto).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await ProductoExists(id))
                    return false;
                else
                    throw;
            }

            return true;
        }

        public async Task<bool> DeleteProductoAsync(int id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null)
                return false;

            _context.Productos.Remove(producto);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<int> GetStockAsync(int idProducto)
        {
            var producto = await _context.Productos.FindAsync(idProducto);
            if (producto == null)
            {
                throw new ArgumentException($"El producto con ID {idProducto} no existe.");
            }
            return producto.Stock;
        }

        public async Task<bool> ActualizarStockAsync(int idProducto, int cantidad)
        {
            var producto = await _context.Productos.FindAsync(idProducto);
            if (producto == null)
            {
                throw new ArgumentException($"El producto con ID {idProducto} no existe.");
            }

            if (producto.Stock < cantidad)
            {
                return false; // No hay suficiente stock disponible para la cantidad solicitada
            }

            producto.Stock -= cantidad; // Restar la cantidad solicitada al stock disponible
            await _context.SaveChangesAsync();
            return true; // Actualización exitosa del stock
        }

        public async Task<bool> ProductoExists(int id)
        {
            return await _context.Productos.AnyAsync(e => e.IdProducto == id);
        }
    }

}
