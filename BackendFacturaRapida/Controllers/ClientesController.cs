using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendFacturaRapida.Models.DB;
using BackendFacturaRapida.Repositories.ClienteRepository;
using BackendFacturaRapida.Models.View.Cliente;

namespace BackendFacturaRapida.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        private readonly IClienteRepository _clientesRepository;

        public ClientesController(IClienteRepository repository)
        {
            _clientesRepository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetClientes()
        {
            var clientes = await _clientesRepository.GetClientes();
            return Ok(clientes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Cliente>> GetCliente(int id)
        {
            var cliente = await _clientesRepository.GetCliente(id);

            if (cliente == null)
            {
                return NotFound();
            }

            return Ok(cliente);
        }

        [HttpGet("estado")]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetClientesByEstado(bool activo)
        {
            return await _clientesRepository.GetAllClientesByEstadoAsync(activo);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCliente(int id, Cliente cliente)
        {

            if (id != cliente.IdCliente)
            {
                return BadRequest();
            }

            try
            {
                await _clientesRepository.UpdateCliente(cliente);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _clientesRepository.ClienteExists(id))
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

        [HttpPost]
        public async Task<ActionResult<Cliente>> PostCliente(Cliente cliente)
        {
            await _clientesRepository.AddCliente(cliente);
            return CreatedAtAction("GetCliente", new { id = cliente.IdCliente }, cliente);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCliente(int id)
        {
            var cliente = await _clientesRepository.GetCliente(id);
            if (cliente == null)
            {
                return NotFound();
            }

            await _clientesRepository.DeleteCliente(id);
            return NoContent();
        }

        [HttpPut("actualizar/{id}")]
        public async Task<IActionResult> ActualizarCliente(int id, ClienteViewModel clienteViewModel)
        {
            var cliente = await _clientesRepository.GetCliente(id);

            cliente.Nombre = clienteViewModel.Nombre;
            cliente.Direccion = clienteViewModel.Direccion;
            cliente.Correo = clienteViewModel.Correo;
            cliente.RucDni = clienteViewModel.RucDni;
            cliente.RazonSocial = clienteViewModel.RazonSocial;
            cliente.Activo = clienteViewModel.Activo;

            try
            {
                await _clientesRepository.UpdateCliente(cliente);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _clientesRepository.ClienteExists(id))
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
