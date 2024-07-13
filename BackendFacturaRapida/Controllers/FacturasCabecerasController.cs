
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendFacturaRapida.Models.DB;
using BackendFacturaRapida.Repositories.FacturaRepository.Cabecera;
using BackendFacturaRapida.Models.View.Factura;

namespace BackendFacturaRapida.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class FacturasCabecerasController : ControllerBase
    {
        private readonly IFacturasCabecerasRepository _repository;

        public FacturasCabecerasController(IFacturasCabecerasRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FacturasCabecera>>> GetFacturasCabeceras()
        {
            var result = await _repository.GetFacturasCabecerasAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FacturasCabecera>> GetFacturasCabecera(int id)
        {
            var facturasCabecera = await _repository.GetFacturasCabeceraAsync(id);
            if (facturasCabecera == null)
            {
                return NotFound();
            }
            return Ok(facturasCabecera);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutFacturasCabecera(int id, FacturasCabecera facturasCabecera)
        {
            if (id != facturasCabecera.IdFactura)
            {
                return BadRequest();
            }
            try
            {
                await _repository.UpdateFacturasCabeceraAsync(facturasCabecera);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _repository.FacturasCabeceraExistsAsync(id))
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
        public async Task<ActionResult<FacturasCabecera>> PostFacturasCabecera(FacturasCabecera facturasCabecera)
        {
            await _repository.AddFacturasCabeceraAsync(facturasCabecera);
            return CreatedAtAction("GetFacturasCabecera", new { id = facturasCabecera.IdFactura }, facturasCabecera);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFacturasCabecera(int id)
        {
            var facturasCabecera = await _repository.GetFacturasCabeceraAsync(id);
            if (facturasCabecera == null)
            {
                return NotFound();
            }
            await _repository.DeleteFacturasCabeceraAsync(id);
            return NoContent();
        }
    }
}
