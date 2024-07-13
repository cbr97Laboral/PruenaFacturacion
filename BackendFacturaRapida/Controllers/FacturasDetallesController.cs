using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendFacturaRapida.Models.DB;
using BackendFacturaRapida.Repositories.FacturaRepository.Detalle;

namespace BackendFacturaRapida.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class FacturasDetallesController : ControllerBase
    {
        private readonly IFacturasDetallesRepository _repository;

        public FacturasDetallesController(IFacturasDetallesRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FacturasDetalle>>> GetFacturasDetalles()
        {
            var facturasDetalles = await _repository.GetAllAsync();
            return Ok(facturasDetalles);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FacturasDetalle>> GetFacturasDetalle(int id)
        {
            var facturasDetalle = await _repository.GetByIdAsync(id);

            if (facturasDetalle == null)
            {
                return NotFound();
            }

            return Ok(facturasDetalle);
        }

        [HttpGet("detalles/{idFactura}")]
        public async Task<ActionResult<IEnumerable<FacturasDetalle>>> GetDetallesByFacturaId(int idFactura)
        {
            var facturasDetalles = await _repository.GetByFacturaIdAsync(idFactura);
            return Ok(facturasDetalles);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutFacturasDetalle(int id, FacturasDetalle facturasDetalle)
        {
            if (id != facturasDetalle.IdItem)
            {
                return BadRequest();
            }

            try
            {
                await _repository.UpdateAsync(facturasDetalle);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _repository.ExistsAsync(id))
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
        public async Task<ActionResult<FacturasDetalle>> PostFacturasDetalle(FacturasDetalle facturasDetalle)
        {
            await _repository.AddAsync(facturasDetalle);
            return CreatedAtAction("GetFacturasDetalle", new { id = facturasDetalle.IdItem }, facturasDetalle);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFacturasDetalle(int id)
        {
            if (!await _repository.ExistsAsync(id))
            {
                return NotFound();
            }

            await _repository.DeleteAsync(id);
            return NoContent();
        }
    }
}
