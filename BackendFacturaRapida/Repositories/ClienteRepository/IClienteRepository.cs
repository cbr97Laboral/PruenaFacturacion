using BackendFacturaRapida.Models.DB;

namespace BackendFacturaRapida.Repositories.ClienteRepository
{
    public interface IClienteRepository
    {
        Task<IEnumerable<Cliente>> GetClientes();
        Task<Cliente> GetCliente(int id);
        Task AddCliente(Cliente cliente);
        Task UpdateCliente(Cliente cliente);
        Task DeleteCliente(int id);
        Task<bool> ClienteExists(int id);
    }
}
