using BackendFacturaRapida.Models.DB;
using Microsoft.EntityFrameworkCore;

namespace BackendFacturaRapida.Repositories.FacturaRepository.Cabecera
{
    public class FacturasCabecerasRepository : IFacturasCabecerasRepository
    {
        private readonly FacturacionRapidaDevContext _context;

        public FacturasCabecerasRepository(FacturacionRapidaDevContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<FacturasCabecera>> GetFacturasCabecerasAsync()
        {
            return await _context.FacturasCabeceras.ToListAsync();
        }

        public async Task<FacturasCabecera> GetFacturasCabeceraAsync(int id)
        {
            return await _context.FacturasCabeceras.FindAsync(id);
        }

        public async Task AddFacturasCabeceraAsync(FacturasCabecera facturasCabecera)
        {
            _context.FacturasCabeceras.Add(facturasCabecera);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateFacturasCabeceraAsync(FacturasCabecera facturasCabecera)
        {
            _context.Entry(facturasCabecera).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteFacturasCabeceraAsync(int id)
        {
            var facturasCabecera = await _context.FacturasCabeceras.FindAsync(id);
            if (facturasCabecera != null)
            {
                _context.FacturasCabeceras.Remove(facturasCabecera);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> FacturasCabeceraExistsAsync(int id)
        {
            return await _context.FacturasCabeceras.AnyAsync(e => e.IdFactura == id);
        }
    }
}
