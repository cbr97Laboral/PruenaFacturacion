using Microsoft.AspNetCore.Mvc;
using BackendFacturaRapida.Models.View.Factura;
using BackendFacturaRapida.Models.DB;
using BackendFacturaRapida.Repositories.FacturaRepository.Cabecera;
using BackendFacturaRapida.Repositories.Productos;
using BackendFacturaRapida.Repositories.ClienteRepository;
using BackendFacturaRapida.Repositories.FacturaRepository.Detalle;

namespace BackendFacturaRapida.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class FacturasController : ControllerBase
    {
        private readonly IFacturasCabecerasRepository _repository;
        private readonly IProductosRepository _productosRepository;
        private readonly IClienteRepository _clienteRepository;
        private readonly IFacturasDetallesRepository _detallesRepository;
        private readonly FacturacionRapidaDevContext _context;


        public FacturasController(IFacturasCabecerasRepository repository, IProductosRepository productosRepository, IClienteRepository clienteRepository, IFacturasDetallesRepository detallesRepository, FacturacionRapidaDevContext context)
        {
            _repository = repository;
            _productosRepository = productosRepository;
            _clienteRepository = clienteRepository;
            _detallesRepository = detallesRepository;
            _context = context;
        }

        [HttpPost("crearfactura")]
        public async Task<ActionResult> CrearFactura(Factura factura)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var clienteExistente = await _clienteRepository.GetCliente(factura.IdCliente);
                if (clienteExistente == null)
                {
                    return BadRequest("El cliente especificado no existe.");
                }

                var detallesCompletos = new List<FacturasDetalle>();
                foreach (var detalle in factura.Detalles)
                {
                    var productoExistente = await _productosRepository.GetProductoByIdAsync(detalle.IdProducto);
                    if (productoExistente == null)
                    {
                        return BadRequest($"El producto con ID {detalle.IdProducto} no existe.");
                    }

                    var stockDisponible = await _productosRepository.GetStockAsync(detalle.IdProducto);
                    if (stockDisponible < detalle.CantidadSolicitada)
                    {
                        return BadRequest($"No hay suficiente stock para el producto {productoExistente.Nombre} (ID: {detalle.IdProducto}). Stock disponible: {stockDisponible}");
                    }

                    detallesCompletos.Add(new FacturasDetalle
                    {
                        IdProducto = productoExistente.IdProducto,
                        CodigoProducto = productoExistente.Codigo,
                        NombreProducto = productoExistente.Nombre,
                        PrecioProducto = productoExistente.Precio,
                        CantidadSolicitada = detalle.CantidadSolicitada
                    });
                }

                var cabecera = new FacturasCabecera
                {
                    NumeroFactura = ObtenerNumeroFacturaAleatorio(),
                    IdCliente = clienteExistente.IdCliente,
                    RucDniCliente = clienteExistente.RucDni,
                    RazonSocialCliente = clienteExistente.RazonSocial,
                    Correo = clienteExistente.Correo,
                    Subtotal = detallesCompletos.Sum(d => d.CantidadSolicitada * d.PrecioProducto),
                    IvgPorcentual = factura.IvgPorcentual,
                    FacturasDetalles = detallesCompletos
                };

                await _repository.AddFacturasCabeceraAsync(cabecera);

                foreach (var detalle in detallesCompletos)
                {
                    await _productosRepository.DisminuirStockAsync(detalle.IdProducto, (uint)detalle.CantidadSolicitada);
                }

                return Ok(new { mensaje= "Exito", numeroFactura = cabecera.NumeroFactura, idFactura= cabecera.IdFactura});
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        private int ObtenerNumeroFacturaAleatorio()
        {
            Random rnd = new Random();
            return rnd.Next(1000, 9999);
        }

        [HttpDelete("eliminarfacturas/{id}")]
        public async Task<ActionResult> EliminarFactura(int id)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var cabecera = await _repository.GetFacturasCabeceraAsync(id);
                if (cabecera == null)
                {
                    return NotFound($"No se encontró la factura con ID {id}");
                }

                var detalles = await _detallesRepository.GetByFacturaIdAsync(id);
                foreach (var detalle in detalles)
                {
                    await _detallesRepository.DeleteAsync(detalle.IdItem);
                    await _productosRepository.AumentarStockAsync(detalle.IdProducto, (uint)detalle.CantidadSolicitada);
                }

                await _repository.DeleteFacturasCabeceraAsync(id);

                await transaction.CommitAsync();

                return Ok($"Factura con ID {id} eliminada correctamente");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Error interno del servidor al eliminar la factura: {ex.Message}");
            }
        }
    }
}
