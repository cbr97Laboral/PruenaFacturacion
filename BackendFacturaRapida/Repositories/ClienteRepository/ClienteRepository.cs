using BackendFacturaRapida.Models.DB;
using Microsoft.EntityFrameworkCore;

namespace BackendFacturaRapida.Repositories.ClienteRepository
{
    public class ClienteRepository : IClienteRepository
    {
        private readonly FacturacionRapidaDevContext _context;

        public ClienteRepository(FacturacionRapidaDevContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Cliente>> GetClientes()
        {
            return await _context.Clientes.ToListAsync();
        }

        public async Task<Cliente> GetCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id) ?? throw new ArgumentException($"El cliente con ID {id} no existe.");
            return cliente;
        }

        public async Task<List<Cliente>> GetAllClientesByEstadoAsync(bool activo)
        {
            return await _context.Clientes
                                 .Where(p => p.Activo == activo)
                                 .ToListAsync();
        }

        public async Task AddCliente(Cliente cliente)
        {
            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateCliente(Cliente cliente)
        {
            _context.Entry(cliente).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente != null)
            {
                _context.Clientes.Remove(cliente);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ClienteExists(int id)
        {
            return await _context.Clientes.AnyAsync(e => e.IdCliente == id);
        }
    }
}
