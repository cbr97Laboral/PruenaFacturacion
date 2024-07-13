using Microsoft.AspNetCore.Mvc;
using BackendFacturaRapida.Models.DB;
using BackendFacturaRapida.Repositories.Productos;
using BackendFacturaRapida.Models.View.Producto;
using Microsoft.EntityFrameworkCore;
using BackendFacturaRapida.Models.View.Cliente;
using NuGet.Protocol.Core.Types;

namespace BackendFacturaRapida.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly IProductosRepository _productosRepository;

        public ProductosController(IProductosRepository productosRepository)
        {
            _productosRepository = productosRepository;
        }

        // GET: api/Productos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProductos()
        {
            return await _productosRepository.GetAllProductosAsync();
        }

        // GET: api/Productos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Producto>> GetProducto(int id)
        {
            var producto = await _productosRepository.GetProductoByIdAsync(id);

            if (producto == null)
            {
                return NotFound();
            }

            return producto;
        }

        // PUT: api/Productos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProducto(int id, Producto producto)
        {
            var result = await _productosRepository.UpdateProductoAsync(id, producto);
            if (!result)
                return NotFound();

            return NoContent();
        }

        // POST: api/Productos
        [HttpPost]
        public async Task<ActionResult<Producto>> PostProducto(Producto producto)
        {
            var newProducto = await _productosRepository.AddProductoAsync(producto);
            return CreatedAtAction("GetProducto", new { id = newProducto.IdProducto }, newProducto);
        }

        // DELETE: api/Productos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProducto(int id)
        {
            var result = await _productosRepository.DeleteProductoAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpPut("actualizar/{id}")]
        public async Task<IActionResult> ActualizarCliente(int id, ProductoViewModel clienteViewModel)
        {
            var producto = await _productosRepository.GetProductoByIdAsync(id);

            producto.Nombre = clienteViewModel.Nombre;
            producto.Precio = clienteViewModel.Precio;
            producto.Stock = clienteViewModel.Stock;
            producto.Codigo = clienteViewModel.Codigo;
            producto.Activo = clienteViewModel.Activo; ;

            try
            {
                await _productosRepository.UpdateProductoAsync(id,producto);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _productosRepository.ProductoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

    }

}
