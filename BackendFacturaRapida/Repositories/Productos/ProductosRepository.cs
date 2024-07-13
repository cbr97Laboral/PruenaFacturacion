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
            var producto = await _context.Productos.FindAsync(id) ?? throw new ArgumentException($"El producto con ID {id} no existe.");
            return producto;
        }

        public async Task<List<Producto>> GetAllProductosByEstadoAsync(bool activo)
        {
            return await _context.Productos
                                 .Where(p => p.Activo == activo)
                                 .ToListAsync();
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

        public async Task<bool> AumentarStockAsync(int idProducto, uint cantidad)
        {
            var producto = await GetProductoByIdAsync(idProducto);

            producto.Stock += (int)cantidad;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DisminuirStockAsync(int idProducto, uint cantidad)
        {
            var producto = await GetProductoByIdAsync(idProducto);

            if (producto.Stock < cantidad)
            {
                return false;
            }

            producto.Stock -= (int)cantidad;
            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<bool> ProductoExists(int id)
        {
            return await _context.Productos.AnyAsync(e => e.IdProducto == id);
        }
    }

}
