using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendFacturaRapida.Models.DB;
using BackendFacturaRapida.Repositories.ClienteRepository;
using BackendFacturaRapida.Models.View.Cliente;
using NuGet.Protocol.Core.Types;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System;

namespace BackendFacturaRapida.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        private readonly IClienteRepository _repository;

        public ClientesController(IClienteRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetClientes()
        {
            var clientes = await _repository.GetClientes();
            return Ok(clientes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Cliente>> GetCliente(int id)
        {
            var cliente = await _repository.GetCliente(id);

            if (cliente == null)
            {
                return NotFound();
            }

            return Ok(cliente);
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
                await _repository.UpdateCliente(cliente);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _repository.ClienteExists(id))
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
            await _repository.AddCliente(cliente);
            return CreatedAtAction("GetCliente", new { id = cliente.IdCliente }, cliente);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCliente(int id)
        {
            var cliente = await _repository.GetCliente(id);
            if (cliente == null)
            {
                return NotFound();
            }

            await _repository.DeleteCliente(id);
            return NoContent();
        }

        [HttpPut("actualizar/{id}")]
        public async Task<IActionResult> ActualizarCliente(int id, ClienteViewModel clienteViewModel)
        {
            var cliente = await _repository.GetCliente(id);

            cliente.Nombre = clienteViewModel.Nombre;
            cliente.Direccion = clienteViewModel.Direccion;
            cliente.Correo = clienteViewModel.Correo;
            cliente.RucDni = clienteViewModel.RucDni;
            cliente.RazonSocial = clienteViewModel.RazonSocial;
            cliente.Activo = clienteViewModel.Activo;

            try
            {
                await _repository.UpdateCliente(cliente);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _repository.ClienteExists(id))
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
