using BackendFacturaRapida.Models.DB;
using Microsoft.EntityFrameworkCore;

namespace BackendFacturaRapida.Repositories.FacturaRepository.Detalle
{
    public class FacturasDetallesRepository : IFacturasDetallesRepository
    {
        private readonly FacturacionRapidaDevContext _context;

        public FacturasDetallesRepository(FacturacionRapidaDevContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<FacturasDetalle>> GetAllAsync()
        {
            return await _context.FacturasDetalles.ToListAsync();
        }

        public async Task<FacturasDetalle> GetByIdAsync(int id)
        {
            return await _context.FacturasDetalles.FindAsync(id);
        }

        public async Task AddAsync(FacturasDetalle facturasDetalle)
        {
            _context.FacturasDetalles.Add(facturasDetalle);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(FacturasDetalle facturasDetalle)
        {
            _context.Entry(facturasDetalle).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var facturasDetalle = await _context.FacturasDetalles.FindAsync(id);
            if (facturasDetalle != null)
            {
                _context.FacturasDetalles.Remove(facturasDetalle);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<FacturasDetalle>> GetByFacturaIdAsync(int idFactura)
        {
            return await _context.FacturasDetalles
                .Where(fd => fd.IdFactura == idFactura)
                .ToListAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.FacturasDetalles.AnyAsync(e => e.IdItem == id);
        }
    }
}
